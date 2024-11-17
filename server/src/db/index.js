import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected ! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB



// import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants";

// const app = express()


// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)


//         app.on("ERROR", (error)=>{
//             console.log(error);
//             throw error
//         })


//         app.listen(process.env.PORT , ()=>{

//             console.log(`App is listing to port ${process.env.PORT}`);

//         })

//     } catch (error) {
//         console.error("ERROR" , error);
//         throw error
//     }


// })()