import express from "express";
import {
  addComment,
  getCommentsByReview,
  getRepliesByComment,
  deleteComment,
  updateComment,
  toggleCommentLike
} from "../controllers/comment.controller.js";

const router = express.Router();

/*
========================================
            COMMENT ROUTES
========================================
*/

/* Add comment (or reply) */
router.post("/:reviewId", addComment);

/* Get main comments for a review (pagination) */
router.get("/:reviewId", getCommentsByReview);

/* Get replies for a specific comment */
router.get("/replies/:commentId",getRepliesByComment);

/* Update comment */
router.patch("/:commentId", updateComment);

/* Delete comment */
router.delete("/:commentId", deleteComment);
router.patch("/like/:commentId", toggleCommentLike);


export default router;
