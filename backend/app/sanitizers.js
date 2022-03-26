import Web3 from 'web3';

export function toChecksumAddress(address) {
    try {
        return Web3.utils.toChecksumAddress(address);
    } catch (err) {
        return address;
    }
}
