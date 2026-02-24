import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String },
  authors: [{ type: String }],
  category: { type: String },
  description: { type: String },
  googleId: { type: String, unique: true },
  image: { type: String },
  pageCount: { type: Number },
  rating: { type: Number, min: 0, max: 5 },
  currentPage:{type:Number,default:0},
  currentlyreading:{type:Boolean,default: false},
  completed:{type:Boolean,default: false},
  completiondate:{type:Date,default:null},
  bookmark:{type:Boolean,default: true},
  
}, { timestamps: true });

export const Book = mongoose.model("Book",bookSchema) 