import { Review } from "../models/review.model.js"; // import your Review model
import { User } from "../models/user.model.js"

const reviewpost = async (req, res) => {
    try {
        const {
            userId,
            bookid,
            reviewText,
            rating,
            title,
            authors,
            category,
            image,
            pagecount,
            completiondate,
        } = req.body;

        // Check if the review already exists
        const existingReview = await Review.findOne({ userId, bookId: bookid });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this book." });
        }

        // Create new review
        const newReview = new Review({
            userId,
            bookId: bookid,
            reviewText,
            rating,
            bookData: {
                title,
                authors: Array.isArray(authors) ? authors : [ authors ],
                category,
                image,
                pageCount: pagecount,
                completionDate: completiondate,
            },
        });

        const savedReview = await newReview.save();

        res.status(201).json({ message: "Review created successfully", review: savedReview });
    } catch (error) {
        console.error("Error while posting review:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const postprivate = async (req, res) => {
    try {
        const { bookid, userId } = req.body; // bookId and userId
        if (!bookid || !userId) {
            return res.status(400).json({ message: "Book ID and User ID are required" });
        }

        // Find the review by bookId and userId
        const review = await Review.findOne({ bookId: bookid, userId: userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Update isPublic to true
        review.isPublic = true;
        await review.save();

        res.status(200).json({ message: "Review is now public", review });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const fetchpost = async (req, res) => {
    try {
        // Fetch all reviews where isPublic is true
        const publicReviews = await Review.find({ isPublic: true })
            .populate("userId", "fullName") // optional: get user info
            .populate("bookId", "title image"); // optional: get book info

        res.status(200).json({ reviews: publicReviews });
    } catch (error) {
        console.error("Error fetching public reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const toggleLike = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { userId } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const alreadyLiked = review.likedBy.some(
            (id) => id.toString() === userId
        );

        if (alreadyLiked) {
            review.likedBy = review.likedBy.filter(
                (id) => id.toString() !== userId
            );
        } else {
            review.likedBy.push(userId);
        }

        await review.save();

        res.status(200).json({
            message: alreadyLiked ? "Unliked" : "Liked",
            review,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const toggleSavePost = async (req, res) => {
    try {
        const { reviewId, userId } = req.body;

        // 1. Correct syntax: findById takes the ID directly, not an object
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check if the post is already saved
        const isSaved = user.saved.includes(reviewId);

        let updatedUser;
        if (isSaved) {
            // Remove it if it exists (Unsave)
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { saved: reviewId } },
                { new: true } // returns the updated document
            );
        } else {
            // Add it if it doesn't exist (Save)
            // $addToSet prevents duplicates automatically
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { saved: reviewId } },
                { new: true }
            );
        }

        // 3. Return the actual 'saved' array so Redux can update state.userSavedPosts
        res.status(200).json({
            message: isSaved ? "Removed from saved" : "Saved successfully",
            saved: updatedUser.saved
        });

    } catch (error) {
        console.error("Save Toggle Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
const fetchsaveddata = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const finduser = await User.findById(userId)
            .populate({
                path: "saved",
                // This populates the user info of the person who wrote the review
                populate: {
                    path: "userId",
                    select: "fullName avatar" 
                }
            })
            .select("-password");

        if (!finduser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(finduser.saved || []);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
const removeparticularbookmark = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { saved: bookId } },
      { new: true }
    );

    res.status(200).json({
      message: "Removed successfully",
      saved: updatedUser.saved
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export { reviewpost, postprivate, fetchpost, toggleLike, toggleSavePost, fetchsaveddata ,removeparticularbookmark};
