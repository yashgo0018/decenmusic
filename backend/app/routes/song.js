import { Router } from "express";
import { body, query } from "express-validator";
import sequelize from "../database.js";
import { file, validate } from "../middlewares.js";
import { onlyAuthorized } from "../protection_middlewares.js";
import mime from 'mime';
import { uploadToIPFS } from "../ipfs.js";
import Web3 from "web3";
import { signMessage } from "../helpers.js";

const router = Router();
const { songs: Song } = sequelize.models;

router.post(
    "/",
    onlyAuthorized,
    body("name").isLength({ min: 1 }),
    body("description").isLength({ min: 1 }),
    // file("musicFile", "audio"),
    file("poster", "image"),
    validate,
    async (req, res) => {
        const user = req.user;
        const { poster, musicFile } = req.files;
        const { name, description } = req.body;
        console.log(poster);
        const randomNumber = parseInt(Math.random() * 1_000_000_000 - 100_000_000).toString();
        const posterFilename = `${randomNumber}.${mime.extension(poster.mimetype)}`;
        const posterFilepath = `./uploads/${posterFilename}`;
        await new Promise((resolve, reject) => {
            poster.mv(posterFilepath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        const musicFilename = `${randomNumber}.${mime.extension(musicFile.mimetype)}`;
        const musicFilepath = `./uploads/${musicFilename}`;
        await new Promise((resolve, reject) => {
            musicFile.mv(musicFilepath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        let metadata = (await uploadToIPFS(posterFilepath, musicFilepath, name, description, [{
            trait_type: "Artist",
            value: user.name
        }])).url;
        metadata = metadata.slice(7);
        const song = await Song.create({
            artistAddress: user.address,
            name,
            description,
            posterImage: `/media/${posterFilename}`,
            music: `/media/${musicFilename}`,
            metadata
        });
        const hash = Web3.utils.soliditySha3(user.address, metadata, song.id);
        const { signature } = signMessage(hash);
        song.signature = signature;
        song.save();
        res.json({ metadata, nonce: song.id, signature });
    });

router.get("/pending", onlyAuthorized, async (req, res) => {
    const { user } = req;
    const songs = await Song.findAll({
        where: {
            artistAddress: user.address,
            minted: false
        }
    });
    res.json({ songs: songs.map(({ name, metadata, id, signature }) => ({ name, metadata, id, signature })) });
})

router.get(
    "/",
    onlyAuthorized,
    query("page").isNumeric(),
    query("size").isNumeric(),
    async (req, res) => {
        let { page, limit } = req.query;
        if (!page)
            page = 1;
        if (!limit)
            limit = 24;
        const offset = (page - 1) * limit;
        const count = await Song.findAndCountAll({ where: { minted: true } });
        const pages = Math.ceil(count / limit);
        const songs = await Song.findAll({
            where: {
                minted: true
            },
            attributes: ['id', 'name', 'posterImage', 'music', 'description'],
            limit,
            offset
        });
        res.json({ songs, pages, count })
    });

router.get("/:id", onlyAuthorized, async (req, res) => {
    const { id } = req.params;
    const song = await Song.findOne({ where: { id, minted: true } });
    if (!song) {
        return res.status(404).json({ message: "Song not found" });
    }
    return res.json({ song });
});

export default router;