//FOR USER MODELS 

import mongoose from "mongoose";
import { Schema  } from "mongoose";


//JWT IS A TOKEN 
    import jwt from "jsonwebtoken";
//BCRYPT IS A PACKAGE USED FOR ENCRIPTION OF PASSWORD
    import bcrypt from "bcrypt" 

const userSchema = new Schema(
    {
        username : {
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email : {
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullName : {
                type: String,
                required : true,
                trim : true,
                index : true
            },
        avatar : {
            type : String, // url 
            required : true,

        },
        coverImage :{
            type : String //url
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],

        password : {
            type : String,
            required : [true , "password is required"] // ITS A KIND OF ERROR MASSAGE 
        },
        refreshToken :{
            type : String
        }
    
    
    },
    {
        timestamps : true 
    }
    
)

//MONGOOSE MIDDLEWARE BEFORE SAVED INTO DB USE THIS METHOD 

//WHAT ITS DO :- ITS ENCRIPT THE PASSWORD USING BCRYPT PACKAGE 
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password , 10)

    next()
})



//EVERY TIME USERSCHEMA'S INSTANCE GENRATED THIS METHOD INVOKE 

//WHAT IT DO :- ITS CHECK WHETHER USER ENTERD PASSWORD AND ENCRIPTED PASSWORD IS SAME OR NOT
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}




//SIMPLY GENRATE A TOKEN USING JWT 
userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
        {
        _id: this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {   
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
)

}

//SIMPLY GENRATE A TOKEN USING JWT
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
        _id: this._id,
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
)
}



export const User = mongoose.model("User", userSchema)