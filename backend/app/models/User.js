import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";
import { generateNonce } from "../helpers.js";

class User extends Model {
    static async getOrCreate(address) {
        address = toChecksumAddress(address);
        let user = await User.findOne({
            where: { address }
        });
        if (user) return user;
        user = new User({
            address,
            nonce: generateNonce()
        });
        user.save();
        return user;
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: DataTypes.STRING,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nonce: {
        type: DataTypes.STRING
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastBlock: {
        type: DataTypes.INTEGER,
    },
    donationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    currentNonce: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "users"
})

export default User;