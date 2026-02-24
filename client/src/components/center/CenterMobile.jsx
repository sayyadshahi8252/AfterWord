import React, { useEffect, useState } from "react";
import styles from "./CenterMobile.module.css";
import profile from "../../assets/images/profile (1).png";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPost, toggleLike, toggleSavePost } from "../../Redux/reviewSlice/reviewSlice";
import beforelike from "../../assets/images/beforelike.png";
import afterlike from "../../assets/images/afterlike.png";
import CommentModal from "../comments/CommentModal";

const timeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60)
    return `${diff} sec${diff > 1 ? "s" : ""} ago`;

  if (diff < 3600)
    return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? "s" : ""
      } ago`;

  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""
      } ago`;

  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""
    } ago`;
};

const CenterMobile = () => {
  const dispatch = useDispatch();
  const { publicReviews, isLoading } = useSelector(
    (state) => state.reviews
  );

  const [ selectedReview, setSelectedReview ] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  useEffect(() => {
    dispatch(fetchAllPost());
  }, [ dispatch ]);

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading posts...
      </p>
    );
  }

  const handlesavebutton=async(reviewId)=>{
   if(!userId){
    alert("logged in first")
   }
       dispatch(toggleSavePost({reviewId,userId}))
  }

  return (
    <div className={styles.centerMobile}>
      {/* Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerText}>
          <h3>Welcome to AfterWord!</h3>
          <p>
            Your personal book tracking social space.
            Share and discover insights!
          </p>
        </div>
      </div>

      {/* Posts */}
      {publicReviews && publicReviews.length > 0 ? (
        publicReviews.map((review) => {
          const book = review.bookData || {};

          return (
            <div key={review._id} className={styles.postCard}>
              {/* Header */}
              <div className={styles.postHeader}>
                <img
                  src={profile}
                  alt={review.userId?.fullName || "User"}
                  className={styles.userThumb}
                />

                <p>
                  <strong>{review.userId?.fullName}</strong>{" "}
                  finished reading{" "}
                  <strong>"{book.title}"</strong>
                </p>

                <span className={styles.menuDots}>
                  •••
                </span>
              </div>

              {/* Body */}
              <div className={styles.postBody}>
                <img
                  src={book.image || profile}
                  alt={book.title}
                  className={styles.bookThumb}
                />

                <div className={styles.postContent}>
                  <p>{review.reviewText}</p>

                  <div className={styles.bookDetails}>
                    <span>⭐ {review.rating}</span>
                    <span>📄 {book.pageCount} pages</span>
                    <span>
                      📅 {timeAgo(book.completionDate)}
                    </span>
                    <span >
                      {book.authors?.join(", ") || "Unknown Author"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.postActions}>
                {/* LIKE */}
                <div
                  className={styles.actionItem}
                  onClick={() => {
                    if (!userId) {
                      alert(
                        "Please login to like this post!"
                      );
                      return;
                    }

                    dispatch(
                      toggleLike({
                        reviewId: review._id,
                        userId,
                      })
                    );
                  }}
                  style={{
                    cursor: userId
                      ? "pointer"
                      : "not-allowed",
                    opacity: userId ? 1 : 0.6,
                  }}
                >
                  <img
                    src={
                      review.likedBy?.includes(userId)
                        ? afterlike
                        : beforelike
                    }
                    alt="like"
                    className={styles.likeIcon}
                  />
                  <span>
                    {review.likedBy?.length || 0}
                  </span>

                  {!userId && (
                    <span className={styles.guestHint}>
                      Login required
                    </span>
                  )}
                </div>

                {/* COMMENT */}
                <div
                  className={styles.actionItem}
                  onClick={() => {
                    if (!userId) {
                      alert(
                        "Please login to view comments!"
                      );
                      return;
                    }

                    setSelectedReview(review);
                  }}
                  style={{
                    cursor: userId
                      ? "pointer"
                      : "not-allowed",
                    opacity: userId ? 1 : 0.6,
                  }}
                >
                  💬 Comment (
                  {review.commentCount || 0})
                </div>

                {/* SAVE */}
                <div className={styles.actionItem} onClick={()=>handlesavebutton(review._id)}>
                  🔖 Save
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No public posts available.
        </p>
      )}

      {/* COMMENT MODAL OUTSIDE MAP */}
      {selectedReview && (
        <CommentModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default CenterMobile;
