import React, { useEffect, useState } from "react";
import styles from "./Completed.module.css";
import { useSelector, useDispatch } from "react-redux";
import { completedbook } from "../../../Redux/bookSlice/bookSlice";
import { postprivate, reviewpost } from "../../../Redux/reviewSlice/reviewSlice";

const Completed = () => {
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  const { booksthatiscompleted, isLoading } = useSelector(
    (state) => state.books
  );

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (userId) {
      dispatch(completedbook(userId));
    }
  }, [dispatch, userId]);

  const handleReview = (book) => {
    setSelectedBook(book);
    setShowReviewModal(true);
    setReviewText("");
    setRating(0);
  };

 const handleSubmitReview = () => {
  const alldata = {
    bookid: selectedBook._id,
    userId: userId,
    title: selectedBook.title,
    pagecount: selectedBook.pageCount,
    image: selectedBook.image,
    description: selectedBook.description,
    authors: selectedBook.authors, 
    category:selectedBook.category,
    completiondate: selectedBook.completiondate,
    rating: rating,
    reviewText: reviewText,
  };

  dispatch(reviewpost(alldata));
  setShowReviewModal(false);
};

const handlesharepost=async(bookid)=>{
  console.log(bookid)
  dispatch(postprivate({userId,bookid}))

}

  return (
    <div className={styles.container}>
      <div className={styles.headerInfo}>
        <span className={styles.count}>
          {booksthatiscompleted?.length || 0} Books Finished
        </span>
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading &&
        booksthatiscompleted?.map((book) => (
          <div key={book._id} className={styles.bookCard}>
            <div className={styles.mainContent}>
              <div className={styles.coverWrapper}>
                <img
                  src={book.image}
                  alt={book.title}
                  className={styles.bookCover}
                />
                <div className={styles.ratingBadge}>★ {book.rating || 5}</div>
              </div>

              <div className={styles.details}>
                <div className={styles.topRow}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <span className={styles.durationTag}>
                    {book.pageCount} pages
                  </span>
                </div>
                <p className={styles.authorName}>
                  {book.authors?.join(", ")}
                </p>
                <div className={styles.metaRow}>
                  <span className={styles.finishedOn}>
                    Finished on{" "}
                    {book.completiondate
                      ? new Date(book.completiondate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actionArea}>
              <button
                className={styles.primaryBtn}
                onClick={() => handleReview(book)}
              >
                ✍️ Write a Review
              </button>
              <button className={styles.secondaryBtn} onClick={()=>handlesharepost(book._id)}>📢 Share as Post</button>
              <button className={styles.iconBtn}>•••</button>
            </div>
          </div>
        ))}

      {/* Review Modal */}
      {showReviewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Write a Review for {selectedBook.title}</h2>

            <div className={styles.inputGroup}>
              <label>Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={0}>Select Rating</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Review:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button className={styles.submitBtn} onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Completed;
