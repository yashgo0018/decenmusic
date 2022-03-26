import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class View extends Model { }

View.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize,
    modelName: "views"
});

export default View;