import React, { useState, useEffect } from "react";
import styles from "./Rightbar.module.css";

import quietPower from "../../assets/images/book1.jpg";
import alchemist from "../../assets/images/book1.jpg";
import thinking from "../../assets/images/book1.jpg";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserStats, setbookgoal } from "../../Redux/bookSlice/bookSlice";

const Rightbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [goalText, setGoalText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userid = user?.id;

  const dispatch = useDispatch();

  const { totalbookread, goalbook,genres, isLoading } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    if (userid) {
      dispatch(fetchUserStats(userid));
    }
  }, [dispatch, userid]);

      const {accessToken}=useSelector((state)=>state.users)
      // if (!user || !accessToken) {
      //       return <Navigate to="/login" replace />;
      //   } 

  // ✅ Calculate progress safely
  const progressPercentage =
    goalbook && goalbook > 0
      ? Math.min((totalbookread / goalbook) * 100, 100)
      : 0;

  const handleSave = () => {
    if (!goalText || goalText <= 0) return;

    dispatch(setbookgoal({ userid, goalText: Number(goalText) }));
    setShowModal(false);
    setGoalText("");
  };

  return (
    <div className={styles.rightbar}>
      {/* Reading Goals Card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Reading Goals</h3>

        <div className={styles.goalStats}>
          <span className={styles.count}>
            {totalbookread || 0} / {goalbook || 0}
          </span>
          <span className={styles.subtext}>Books Completed</span>
        </div>

        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <button
          className={styles.setGoalBtn}
          onClick={() => setShowModal(true)}
        >
          Set Goal
        </button>
      </div>

      {/* Trending Books Card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Trending Books</h3>

        <div className={styles.bookList}>
          <div className={styles.bookItem}>
            <img src={quietPower} alt="Quiet Power" />
            <div className={styles.bookInfo}>
              <p className={styles.bookName}>Quiet Power</p>
              <p className={styles.author}>by Susan Cain</p>
            </div>
          </div>

          <div className={styles.bookItem}>
            <img src={alchemist} alt="The Alchemist" />
            <div className={styles.bookInfo}>
              <p className={styles.bookName}>The Alchemist</p>
              <p className={styles.author}>by Paulo Coelho</p>
            </div>
          </div>

          <div className={styles.bookItem}>
            <img src={thinking} alt="Thinking Fast and Slow" />
            <div className={styles.bookInfo}>
              <p className={styles.bookName}>
                Thinking, Fast and Slow
              </p>
              <p className={styles.author}>by Daniel Kahneman</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && accessToken && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Set Your Reading Goal</h3>

            <input
              type="number"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Enter number of books (e.g. 10)"
              className={styles.modalInput}
            />

            <div className={styles.modalButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className={styles.saveBtn}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rightbar;
