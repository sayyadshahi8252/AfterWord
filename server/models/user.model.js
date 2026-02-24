import mongoose from "mongoose";
import { Book } from "./book.model.js"
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [ true, "Full name is required" ],
        trim: true
    },
    username: {
        type: String,
        required: [ true, "Username is required" ],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: true,
        lowercase: true,
        trim: true
    },
    gender: {
        type: String,
        enum: [ "male", "female", "other" ],
        required: true
    },
    password: {
        type: String,
        required: [ true, "Password is required" ]
    },
    avatar: {
        type: String,
        default: ""
    },
    token: {
        type: String
    },
    goal: {
        type: Number,
        default:0
    },
    totalbookread:{type:Number,default:0},
    watchlist: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book" // Link this to a Book model later for your Library page
    } ],
  saved: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review" // Change this from "Comment"
    }
]
}, { timestamps: true });
export const User = mongoose.model("User", userSchema); 