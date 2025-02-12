//require ('dotenv').config({path:'./env'})
//import mongoose from 'mongoose'
import {app} from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // ✅ Load .env first

import connectDB from '../src/Db/index.js';
connectDB()
.then(()=>{app.listen(process.env.port||8000,()=>{
    console.log (`server is running${process.env.port}`)
})})
.catch((error) => {
    console.log("mongodb connection faild",error)
    
})























/*import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';
import express from 'express';
import dotenv from 'dotenv'
dotenv.config();

const app = express();


(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        app.on("error", (error) => {
            console.log(`error ${error}`);
        });

        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.log(`ERROR ${error}`);
        throw error;
    }
})();*/
