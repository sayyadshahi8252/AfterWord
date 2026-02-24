import React, { useEffect, useState } from 'react';
import styles from './Currentlyreading.module.css';
import { currentlyReadingBook, movingtocompleted, updateBookProgress } from '../../../Redux/bookSlice/bookSlice'; // Ensure this thunk exists
import { useDispatch, useSelector } from 'react-redux';

const Currentlyreading = () => {
  const [ cpage, setcurrentpage ] = useState(0);
  const [ tpage, settotalpage ] = useState(0);
  const [ selectedBook, setSelectedBook ] = useState(null);

  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id || userData?._id;

  const { activeBooks, isLoading } = useSelector((state) => state.books);

  useEffect(() => {
    if (userId) {
      dispatch(currentlyReadingBook(userId));
    }
  }, [ dispatch, userId ]);

  const handleOpenPopup = (book) => {
    setSelectedBook(book);
    setcurrentpage(book.currentPage || 0);
    settotalpage(book.pageCount || 0);
  };

  const handlesaveprogress = (e) => {
    e.preventDefault();
    if (Number(cpage) > Number(tpage)) {
      alert("Current page cannot exceed total pages!");
      return;
    }

    dispatch(updateBookProgress({
      bookId: selectedBook._id,
      currentPage: Number(cpage),
      pageCount: Number(tpage)
    }));


    setSelectedBook(null);
  };

  if (isLoading) return <div className={styles.loading}>Loading your books...</div>;

  if (!activeBooks || activeBooks.length === 0) {
    return <div className={styles.noData}>No books currently being read.</div>;
  }

  const handleMoveButton = async (bookId) => {

    dispatch(movingtocompleted({ bookId, userId }))
  }

  return (
    <div className={styles.container}>
      {activeBooks.map((book) => {
        const current = book.currentPage || 0;
        const total = book.pageCount || 1;
        const percentage = Math.round((current / total) * 100);

        return (
          <div key={book._id} className={styles.bookCard}>
            <div className={styles.topSection}>
              <img src={book.image} alt={book.title} className={styles.bookCover} />
              <div className={styles.bookInfo}>
                <div className={styles.headerRow}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <button className={styles.moreOptions}>•••</button>
                </div>
                <p className={styles.authorName}>{book.authors?.join(', ') || 'Unknown Author'}</p>
                <p className={styles.category}>
                  {book.category || "General"}
                </p>

                <div className={styles.progressSection}>
                  <div className={styles.progressText}>
                    <span className={styles.percentText}>{percentage}% Complete</span>
                    <span className={styles.pageText}>Page {current} of {total}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
                <p className={styles.dateInfo}>Started on {new Date(book.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.actionBtn} onClick={() => handleOpenPopup(book)}>
                <span className={styles.icon}>🕒</span> Update Progress
              </button>
              <button className={styles.actionBtn} onClick={() => handleMoveButton(book._id)}><span className={styles.icon}>↪️</span> Move</button>
              <button className={styles.smallActionBtn}>•••</button>
            </div>
          </div>
        );
      })}

      {selectedBook && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Update Progress</h2>
            <p className={styles.modalSubtitle}>{selectedBook.title}</p>

            <div className={styles.inputField}>
              <label>Current Page</label>
              <input
                type="number"
                value={cpage}
                onChange={(e) => setcurrentpage(e.target.value)}
              />
            </div>

            <div className={styles.inputField}>
              <label>Total Pages (Physical Copy)</label>
              <input
                type="number"
                value={tpage}
                onChange={(e) => settotalpage(e.target.value)}
              />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedBook(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handlesaveprogress}>Save Progress</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Currentlyreading;