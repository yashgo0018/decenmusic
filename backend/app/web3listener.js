// Import Dependencies
import Web3 from "web3";
import sequelize from "./database.js";
import decenSongABI from "./abis/DecenSong.json";
const { songs: Song, transfers: Transfer } = sequelize.models;

// Get ENV Variables
const WEB3_RPC = process.env.WEB3_RPC;
const DECENSONG_CONTRACT_ADDRESS = process.env.DECENSONG_CONTRACT_ADDRESS;

// Setup 
const web3 = new Web3(WEB3_RPC);
const songContract = new web3.eth.Contract(decenSongABI, DECENSONG_CONTRACT_ADDRESS);

// Define the event listeners
export default async () => {
    const transfer = await Transfer.findOne({
        order: [
            ['blockNumber', 'DESC']
        ]
    });
    let fromBlock = transfer ? transfer.blockNumber : 0;
    songContract.events.Transfer({ fromBlock }).on('data', async ({ returnValues, blockNumber, transactionHash }) => {
        const { tokenId, from, to } = returnValues;
        let song = await Song.findOne({
            where: {
                id: tokenId
            }
        });
        let transfer = await Transfer.findOne({
            where: { transactionHash }
        });
        if (transfer) return;
        if (from == '0x0000000000000000000000000000000000000000') {
            song.minted = true;
        }
        if (to == '0x0000000000000000000000000000000000000000') {
            song.burned = true;
        }
        song.owner = to;
        await song.save();
        transfer = await Transfer.create({
            senderAddress: from,
            receiverAddress: to,
            transactionHash,
            blockNumber
        });
        song.addTransaction(transfer);
    });
}