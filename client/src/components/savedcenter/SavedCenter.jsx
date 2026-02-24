import React from "react";
import styles from "./SavedCenter.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletebookmark, fetchbookmarkpost } from "../../Redux/reviewSlice/reviewSlice";

const SavedCenter = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  const { bookmark, isLoading } = useSelector(
    (state) => state.reviews
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchbookmarkpost(userId));
    }
  }, [dispatch, userId]);

  const handleRemove=async(bookId)=>{
    dispatch(deletebookmark({userId,bookId}))
   
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Saved Reviews</h2>

      {isLoading ? (
        <p>Loading your collection...</p>
      ) : bookmark.length > 0 ? (
        bookmark.map((post) => (
          <div key={post._id} className={styles.card}>
            <img
              src={post.bookData?.image}
              alt={post.bookData?.title}
              className={styles.image}
            />

            <div className={styles.details}>
              <h3 className={styles.title}>
                {post.bookData?.title}
              </h3>

              <p className={styles.author}>
                ✍ {post.bookData?.authors?.join(", ")}
              </p>

              <p>
                📚 Category: {post.bookData?.category}
              </p>

              <p>
                📄 Pages: {post.bookData?.pageCount}
              </p>

              <p>
                ⭐ Rating: {post.rating}
              </p>

              <p>
                ❤️ Likes: {post.likedBy?.length || 0}
              </p>

              <p className={styles.reviewText}>
                {post.reviewText}
              </p>

              <button className={styles.removeBtn} onClick={()=>handleRemove(post._id)}>
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  );
};

export default SavedCenter;
