import Web3 from "web3";
import User from "./models/User.js";

export function uniqueAddress(address) {
    return User.findOne({
        where: {
            address
        }
    }).then(user => {
        if (!user) {
            return Promise.reject("User nonce not generated yet");
        }
        else if (user.isRegistered) {
            return Promise.reject("User already exists");
        }
    });
}

export function uniqueUsername(username) {
    return User.findOne({
        where: {
            username
        }
    }).then(user => {
        if (user) {
            return Promise.reject("Username already exists");
        }
    });
}

export function isRegistered(address) {
    return User.findOne({
        where: {
            address
        }
    }).then(user => {
        if (!(user && user.isRegistered)) {
            return Promise.reject("User not registered");
        }
    });
}

export function isValidAddress(address) {
    if (!Web3.utils.isAddress(address)) {
        console.log("Invalid address");
        throw new Error("Invalid address");
    }
    return true;
}

export function isValidUsername(username) {
    const re = /^[A-Za-z]\w{3,}$/;
    return Boolean(re.test(username));
}

export function isSlug(slug) {
    const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return Boolean(re.test(slug));
}