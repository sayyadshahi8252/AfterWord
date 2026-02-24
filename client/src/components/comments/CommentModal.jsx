import React, { useEffect, useState } from "react";
import styles from "./CommentModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  toggleCommentLike,
  fetchReplies,
} from "../../Redux/commentSlice/commentSlice";


const CommentModal = ({ review, onClose }) => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const { commentsByReview, repliesByComment, isLoading } =
    useSelector((state) => state.comments);

  const reviewComments =
    commentsByReview[review._id]?.comments || [];

  const page = commentsByReview[review._id]?.page || 1;
  const hasMore =
    commentsByReview[review._id]?.hasMore || false;

  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  /* ===============================
     FETCH MAIN COMMENTS
  =============================== */
  useEffect(() => {
    dispatch(fetchComments({ reviewId: review._id, page: 1 }));
  }, [dispatch, review._id]);

  /* ===============================
     ADD MAIN COMMENT
  =============================== */
  const handleAddComment = () => {
    if (!text.trim()) return;

    dispatch(
      addComment({
        reviewId: review._id,
        userId,
        text,
      })
    );

    setText("");
  };

  /* ===============================
     ADD REPLY
  =============================== */
  const handleReply = (parentId) => {
    if (!replyText.trim()) return;

    dispatch(
      addComment({
        reviewId: review._id,
        userId,
        text: replyText,
        parentComment: parentId,
      })
    );

    setReplyText("");
    setReplyingTo(null);
  };

  /* ===============================
     LOAD MORE COMMENTS
  =============================== */
  const handleLoadMore = () => {
    dispatch(
      fetchComments({
        reviewId: review._id,
        page: page + 1,
      })
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <h3>{review.commentCount || 0} Comments</h3>
          <button onClick={onClose}>✖</button>
        </div>

        {/* COMMENTS LIST */}
        <div className={styles.commentList}>
          {isLoading && <p>Loading...</p>}

          {reviewComments.map((comment) => {
            const isLiked =
              comment.likedBy?.includes(userId);

            return (
              <div key={comment._id} className={styles.commentWrapper}>
                {/* MAIN COMMENT */}
                <div className={styles.comment}>
                  <strong>{comment.userId?.fullName}</strong>
                  <p>{comment.text}</p>

                  <div className={styles.commentActions}>
                    {/* LIKE BUTTON */}
                    <span
                      className={isLiked ? styles.liked : ""}
                      onClick={() =>
                        dispatch(
                          toggleCommentLike({
                            commentId: comment._id,
                            userId,
                          })
                        )
                      }
                    >
                      👍 {comment.likedBy?.length || 0}
                    </span>

                    {/* REPLY BUTTON */}
                    <span
                      onClick={() => {
                        if (replyingTo !== comment._id) {
                          dispatch(fetchReplies(comment._id));
                        }
                        setReplyingTo(
                          replyingTo === comment._id
                            ? null
                            : comment._id
                        );
                      }}
                    >
                      💬 Reply
                    </span>
                  </div>
                </div>

                {/* REPLY INPUT */}
                {replyingTo === comment._id && (
                  <div className={styles.replyInput}>
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) =>
                        setReplyText(e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        handleReply(comment._id)
                      }
                    >
                      Post
                    </button>
                  </div>
                )}

                {/* REPLIES */}
                {repliesByComment[comment._id]?.map(
                  (reply) => {
                    const replyLiked =
                      reply.likedBy?.includes(userId);

                    return (
                      <div
                        key={reply._id}
                        className={styles.reply}
                      >
                        <strong>
                          {reply.userId?.fullName}
                        </strong>
                        <p>{reply.text}</p>

                        <span
                          className={
                            replyLiked
                              ? styles.liked
                              : ""
                          }
                          onClick={() =>
                            dispatch(
                              toggleCommentLike({
                                commentId:
                                  reply._id,
                                userId,
                              })
                            )
                          }
                        >
                          👍 {reply.likedBy?.length || 0}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}

          {/* LOAD MORE */}
          {hasMore && (
            <button
              className={styles.loadMore}
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>

        {/* INPUT AREA */}
        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAddComment}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
