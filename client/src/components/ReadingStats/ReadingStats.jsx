import React, { useEffect } from "react";
import styles from "./ReadingStats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStats } from "../../Redux/bookSlice/bookSlice";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const COLORS = ["#3b71ca", "#2c5282", "#63b3ed", "#4299e1", "#90cdf4"];

const ReadingStats = () => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));
  const userid = user?.id;

  const { totalbookread, goalbook, genres } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    if (userid) {
      dispatch(fetchUserStats(userid));
    }
  }, [dispatch, userid]);

  // ✅ Safe goal percentage
  const goalPercentage =
    goalbook > 0
      ? Math.min(Math.round((totalbookread / goalbook) * 100), 100)
      : 0;

  return (
    <div className={styles.statsPage}>
      <h2 className={styles.sectionTitle}>Reading Performance</h2>

      {/* 1. Yearly Goal Tracker */}
      <div className={styles.goalCard}>
        <div className={styles.goalInfo}>
          <span className={styles.goalLabel}>2026 Reading Goal</span>
          <span className={styles.goalCount}>
            {totalbookread} / {goalbook} Books
          </span>
        </div>

        <div className={styles.fullBar}>
          <div
            className={styles.fillBar}
            style={{ width: `${goalPercentage}%` }}
          ></div>
        </div>

        <p className={styles.goalStatus}>
          {goalPercentage}% of your yearly goal achieved
        </p>
      </div>
  

  
      {/* 2. Genre Breakdown */}
      <div className={styles.chartCard}>
        <h3 className={styles.cardTitle}>Genre Distribution</h3>

        <div className={styles.genreList}>
          {genres && genres.length > 0 ? (
            genres.map((genre, index) => {
              const percentage =
                totalbookread > 0
                  ? Math.round((genre.count / totalbookread) * 100)
                  : 0;

              return (
                <div key={index} className={styles.genreItem}>
                  <div className={styles.genreMeta}>
                    <span className={styles.genreName}>
                      {genre.name}
                    </span>
                    <span className={styles.genreValue}>
                      {percentage}%
                    </span>
                  </div>

                  <div className={styles.barBg}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No completed books yet.
            </p>
          )}
        </div>
      </div>
        <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={genres}
      dataKey="count"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={window.innerWidth < 768 ? 60 : 80} // Smaller radius for mobile
      innerRadius={window.innerWidth < 768 ? 40 : 0} // Optional: Turn into donut for better mobile look
      minAngle={15} // Prevents tiny slices from disappearing
      label={window.innerWidth > 768} // Hide labels on mobile (too crowded)
    >
      {genres.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend 
      verticalAlign="bottom" 
      height={36} 
      iconType="circle"
      layout="horizontal"
      wrapperStyle={{
        paddingTop: '20px',
        fontSize: '12px'
      }}
    />
  </PieChart>
</ResponsiveContainer>
    </div>
  );
};

export default ReadingStats;
