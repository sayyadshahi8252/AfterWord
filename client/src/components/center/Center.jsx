import React, { useEffect, useState } from "react";
import styles from "./Center.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPost, toggleLike,toggleSavePost } from "../../Redux/reviewSlice/reviewSlice";
import profile from "../../assets/images/profile (1).png";
import beforelike from "../../assets/images/beforelike.png";
import afterlike from "../../assets/images/afterlike.png";
import CommentModal from "../comments/CommentModal";

// ✅ Helper function (NO HOOKS HERE)
const timeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const posted = new Date(dateString);
  const seconds = Math.floor((now - posted) / 1000);

  if (seconds < 60)
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30)
    return `${days} day${days !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12)
    return `${months} month${months !== 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

const Center = () => {
  const dispatch = useDispatch();
  const { publicReviews, isLoading } = useSelector(
    (state) => state.reviews
  );

  // ✅ Proper hook placement
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
    <div className={styles.center}>
      {/* Banner */}
      <div className={styles.addbook}>
        <h3>Welcome To AfterWord</h3>
        <p className={styles.subtitle}>
          Your personal book tracking social space.
        </p>
        <p className={styles.subtitle}>
          A room without books is like a body without a soul
        </p>

        <div className={styles.addbookbutton}>
          <p>Read something new today?</p>
          <button className={styles.addBookBtn}>Add Book</button>
        </div>
      </div>

      {/* Posts */}
      {publicReviews && publicReviews.length > 0 ? (
        publicReviews.map((review) => {
          const book = review.bookData || {};

          return (
            <div key={review._id} className={styles.maincontainer}>
              {/* Header */}
              <div className={styles.partone}>
                <div className={styles.profileimage}>
                  <div className={styles.profileWrapper}>
                    <img
                      src={profile}
                      alt={review.userId?.fullName || "profile"}
                    />
                    <span className={styles.statusDot}></span>
                  </div>

                  <div className={styles.headerText}>
                    <p>
                      <span className={styles.userName}>
                        {review.userId?.fullName}
                      </span>
                      <span className={styles.actionText}>
                        {" "}
                        finished reading{" "}
                      </span>
                      <span className={styles.bookTitle}>
                        "{book.title}"
                      </span> {" "}by{" "}
                      <span className={styles.bookTitle}>
                       
                        {book.authors?.join(", ") || "Unknown Author"}
                      </span>
                    </p>

                    {book.category && (
                      <p className={styles.bookCategory}>
                        Category: {book.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.threedot}>
                  <button className={styles.menuButton}>•••</button>
                </div>
              </div>

              {/* Content */}
              <div className={styles.parttwo}>
                <img
                  className={styles.bookImage}
                  src={book.image || profile}
                  alt={book.title}
                />

                <div className={styles.postText}>
                  <p>{review.reviewText}</p>

                  <div className={styles.bookDetails}>
                    <span>⭐ {review.rating || "N/A"}</span>
                    <span>📄 {book.pageCount || "—"} pages</span>
                    <span>
                      📅 Completed {timeAgo(book.completionDate)}
                    </span>
                  </div>

                  <div className={styles.textUnderline}></div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.postFooter}>
                {/* Like */}
                <div
                  className={styles.likeContainer}
                  onClick={() => {
                    if (!userId) {
                      alert("Please login to like this post!");
                      return;
                    }

                    dispatch(
                      toggleLike({
                        reviewId: review._id,
                        userId,
                      })
                    );
                  }}
                >
                  <img
                    className={styles.likeIcon}
                    style={{ opacity: !userId ? 0.6 : 1 }}
                    src={
                      review.likedBy?.includes(userId)
                        ? afterlike
                        : beforelike
                    }
                    alt="like"
                  />

                  <span className={styles.likeCount}>
                    {review.likedBy?.length || 0}
                  </span>

                  {!userId && (
                    <span className={styles.loginToLike}>
                      Login to like
                    </span>
                  )}
                </div>

                {/* Comment */}
                {/* Comment */}
                <div
                  className={styles.footerItem}
                  onClick={() => {
                    if (!userId) {
                      alert("Please login to view comments!");
                      return;
                    }

                    setSelectedReview(review);
                  }}
                  style={{
                    cursor: userId ? "pointer" : "not-allowed",
                    opacity: userId ? 1 : 0.6,
                  }}
                >
                  💬 Comment ({review.commentCount || 0})
                  {!userId && (
                    <span style={{ marginLeft: "6px", fontSize: "12px" }}>
                      (Login required)
                    </span>
                  )}
                </div>


                {/* Save */}
                <div className={styles.footerItem} onClick={()=>handlesavebutton(review._id)}>
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

      {/* ✅ Modal OUTSIDE map */}
      {selectedReview && (
        <CommentModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default Center;
