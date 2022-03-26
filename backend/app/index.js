// config the dotenv
import './load_dotenv.js';

// import dependencies
import express from 'express';
import sequelize from './database.js';
import User from "./models/User.js";
import Transfer from './models/Transfer.js';
import Song from './models/Song.js';
import View from './models/View.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import songRouter from './routes/song.js';
import web3listener from './web3listener.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';

// define the variables
const PORT = process.env.PORT || 8000;

// setup app
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(cors());

// define the model relationships
Song.hasMany(Transfer);
Transfer.belongsTo(Song);
Song.hasMany(View);
User.hasMany(View);
View.belongsTo(Song);
View.belongsTo(User);

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/song', songRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// connect to database and start the server
sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.")
    return sequelize.sync();
}).then(() => {
    console.log("Synced models with database");
    web3listener();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error)
});
