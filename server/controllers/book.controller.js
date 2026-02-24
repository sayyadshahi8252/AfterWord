import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
const addtoWatchlist = async (req, res) => {
    try {
        const {
            googleId,
            title,
            authors,
            description,
            image,
            category,
            pageCount,
            rating,
            userId
        } = req.body;

        if (!googleId || !userId) {
            return res.status(400).json({ message: "Missing required data" });
        }

        let book = await Book.findOne({ googleId });

        if (!book) {
            book = await Book.create({
                googleId,
                title,
                authors: Array.isArray(authors)
                    ? authors
                    : authors
                        ? [ authors ]
                        : [],
                description,
                image,
                category,
                pageCount,
                rating,
            });
        }

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { watchlist: book._id } }
        );

        res.status(201).json({ message: "Book added successfully" });

    } catch (error) {
        console.log("FULL ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

const currentlyreading = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate("watchlist");

        if (!user) return res.status(404).json({ message: "User not found" });

        const filteredWatchlist = user.watchlist.filter(
            book => book.bookmark === true
        );

        res.status(200).json({ watchlist: filteredWatchlist });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

const reading = async (req, res) => {
    try {
        const { bookid } = req.body;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        // Find the book and update its internal status
        const updatedBook = await Book.findByIdAndUpdate(
            bookid,
            {
                currentlyreading: true,
                bookmark: false
            },
            { returnDocument: 'after' }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(updatedBook); // Return the updated book object
    } catch (error) {
        console.error("Error updating book status:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const showingthebookcurrentlyreading = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("watchlist");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const readingNow = user.watchlist.filter(
            book => book.currentlyreading === true && book.completed === false
        );

        res.status(200).json(readingNow);
    } catch (error) {
        console.error("Error fetching user reading list:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const updatebookprogress = async (req, res) => {
    try {
        const { bookId, currentPage, pageCount } = req.body;
        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                currentPage: Number(currentPage),
                pageCount: Number(pageCount)
            },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error fetching user reading list:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const movingtocompleted = async (req, res) => {
    try {
        const { bookId, userId } = req.body; // You need userId to increment their counter

        if (!bookId || !userId) {
            return res.status(400).json({ message: "Book and User ID are required" });
        }

        // 1. Update the Book status
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                completed: true,
                // currentlyreading: false, // Turn off reading status
                completiondate: new Date()
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // 2. Increment the User's totalbookread counter by 1
        // The $inc operator handles the math automatically (current + 1)
        await User.findByIdAndUpdate(
            userId,
            { $inc: { totalbookread: 1 } }
        );

        res.status(200).json({
            message: "Book moved to completed and counter updated!",
            updatedBook
        });

    } catch (error) {
        console.error("Error updating completion status:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const completedbook = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate("watchlist");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const completedBooks = user.watchlist.filter(
            book => book.completed === true
        );

        res.status(200).json(completedBooks);

    } catch (error) {
        console.error("Error fetching completed books:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const setbookgoal = async (req, res) => {
    try {
        const { userid, goalText } = req.body;

        // 1️⃣ Find user correctly
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Update goal properly
        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { goal: goalText },        // ✅ correct object syntax
            { new: true }          // ✅ return updated document
        );

        // 3️⃣ Send updated goal back
        res.status(200).json({
            message: "Goal updated successfully",
            goal: updatedUser.goal
        });

    } catch (error) {
        console.error("Error updating goal:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate("watchlist");   // ✅ THIS IS THE FIX

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Now watchlist contains FULL book objects

        const completedBooks = user.watchlist.filter(
            (book) => book.completed === true
        );

        const totalbookread = completedBooks.length;

        const genreCount = {};

        completedBooks.forEach((book) => {
            const category = book.category || "Others";
            genreCount[ category ] = (genreCount[ category ] || 0) + 1;
        });

        const genres = Object.keys(genreCount).map((key) => ({
            name: key,
            count: genreCount[ key ],
        }));

        res.status(200).json({
            totalbookread,
            goal: user.goal || 0,
            genres,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deletebookById = async (req, res) => {
    try {
        const { userId, bookid } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.watchlist = user.watchlist.filter(id => id.toString() !== bookid);
        await user.save();

        res.status(200).json({ message: "Book removed from watchlist", bookid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
const refreshToken = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
export { addtoWatchlist, currentlyreading, reading, showingthebookcurrentlyreading, updatebookprogress, movingtocompleted, completedbook, setbookgoal, getUserStats, deletebookById ,refreshToken};