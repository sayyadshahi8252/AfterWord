import React, { useEffect } from 'react';
import styles from './WatchList.module.css';
import book1 from '../../../assets/images/book1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { currentlyreading, deletbook, readingcurrently } from '../../../Redux/bookSlice/bookSlice';

const WatchList = () => {
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    if (userId) {
      dispatch(currentlyreading(userId));
    }
  }, [ dispatch, userId ]);

  const { watchlist, isLoading } = useSelector((state) => state.books);

  const handlestartreading = async (id) => {

    dispatch(readingcurrently(id))
  }


  const handleRemove = async (bookid) => {
    await dispatch(deletbook({ userId, bookid }));
    dispatch(currentlyreading(userId)); // re-fetch watchlist
};

  return (
    <div className={styles.container}>
      <div className={styles.headerInfo}>
        <span className={styles.count}>
          {watchlist?.length || 0} Books in Queue
        </span>
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && watchlist?.map((book) => (
        <div key={book._id} className={styles.bookCard}>
          <div className={styles.mainContent}>
            <img
              src={book.image || book1}
              alt={book.title}
              className={styles.bookCover}
            />

            <div className={styles.details}>
              <div className={styles.topRow}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <span className={styles.pageCount}>
                  {book.pageCount} pages
                </span>
              </div>

              <p className={styles.authorName}>
                {book.authors?.join(", ")}
              </p>
              <p className={styles.category}>
                {book.category || "General"}
              </p>

              <div className={styles.reasonBox}>
                <span className={styles.quoteIcon}>“</span>
                <p className={styles.reasonText}>
                  {book.description?.slice(0, 120)}...
                </p>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.addedDate}>
                  Added recently
                </span>
                <span className={styles.sourceTag}>

                  {book.createdAt?.slice(0, 10)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actionArea}>
            <button className={styles.startBtn} onClick={() => handlestartreading(book._id)}>
              <span className={styles.btnIcon}>📖</span> Start Reading
            </button>
            <button className={styles.secondaryBtn} onClick={() => handleRemove(book._id)}>
              Remove
            </button>
            <button className={styles.iconBtn}>•••</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WatchList;
