import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Song extends Model { }

Song.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    artistAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    music: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posterImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metadata: {
        type: DataTypes.STRING,
        allowNull: false
    },
    minted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    burned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    signature: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "songs"
});

export default Song;