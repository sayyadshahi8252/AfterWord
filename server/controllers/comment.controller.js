import {Comment} from "../models/comment.model.js"
import {Review} from "../models/review.model.js"
 const addComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, text, parentComment } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const newComment = await Comment.create({
      reviewId,
      userId,
      text,
      parentComment: parentComment || null,
    });

    // If it is a reply → increase replyCount
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { replyCount: 1 },
      });
    } else {
      // Normal comment → increase review commentCount
      review.commentCount += 1;
      await review.save();
    }

    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "fullName profileImage");

    res.status(201).json({ comment: populatedComment });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

 const getCommentsByReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      reviewId,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "fullName profileImage");

    res.status(200).json({ comments });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

 const getRepliesByComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Comment.find({
      parentComment: commentId,
    })
      .sort({ createdAt: 1 })
      .populate("userId", "fullName profileImage");

    res.status(200).json({ replies });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


 const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { replyCount: -1 },
      });
    } else {
      await Review.findByIdAndUpdate(comment.reviewId, {
        $inc: { commentCount: -1 },
      });
    }

    await Comment.deleteOne({ _id: commentId });

    res.status(200).json({ message: "Comment deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
 const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { text, isEdited: true },
      { new: true }
    ).populate("userId", "fullName profileImage");

    res.status(200).json({ comment: updated });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
 const toggleCommentLike = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment)
    return res.status(404).json({ message: "Not found" });

  const index = comment.likedBy.indexOf(userId);

  if (index === -1) {
    comment.likedBy.push(userId);
  } else {
    comment.likedBy.splice(index, 1);
  }

  await comment.save();
  res.json(comment);
};


export {addComment,getCommentsByReview,getRepliesByComment,deleteComment,updateComment,toggleCommentLike}