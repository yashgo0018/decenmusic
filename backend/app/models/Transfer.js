import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Transfer extends Model { }

Transfer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    senderAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiverAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactionHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blockNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "transfers"
});

export default Transfer;