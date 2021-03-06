import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import jwt from 'jsonwebtoken';
import Web3 from "web3";

export function getNonceMessage(nonce) {
    const template = process.env.NONCE_MESSAGE || "The Nonce is: %";
    return template.replace("%", nonce);
}
export function generateNonce() {
    const options = "ABCDEDFGHIJKLMNOPQRSTUVWXYZ";
    let nonce = "";
    for (let i = 0; i < 32; i++) {
        if (i != 0 && i % 8 == 0) {
            nonce += "-";
        }
        nonce += options.charAt(Math.floor(Math.random() * options.length));
    }
    return nonce;
}
export function verifySignature(data, signature, address) {
    let signer;
    try {
        signer = recoverPersonalSignature({ data, signature });
    } catch (err) {
        return false;
    }
    return signer.toLowerCase() == address.toLowerCase();
}
export function generateJWTToken(address) {
    return jwt.sign({ username: address }, process.env.JWT_SECRET);
}
export function verifyJWTToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}
export function signMessage(hash) {
    const web3 = new Web3();
    const signature = web3.eth.accounts.sign(hash, process.env.SIGNER_PRIVATE_KEY);
    return signature;
}
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}