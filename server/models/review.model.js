import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Book } from "./book.model.js";

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
            index: true,
        },
        reviewText: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        bookData: {
            title: { type: String, required: true },
            authors: [ { type: String } ],
            category: { type: String },
            image: { type: String },
            pageCount: { type: Number },
            completionDate: { type: Date },
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        commentCount: {
  type: Number,
  default: 0,
},


    },
    { timestamps: true }
);

// Ensure a user can only review a book once
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
