import React from 'react';
import styles from './leftbar.module.css';
import profile from '../../assets/images/profile (1).png';
import homeIcon from '../../assets/images/bell.png'; 
import libraryIcon from '../../assets/images/bell.png';
import timelineIcon from '../../assets/images/bell.png';
import exploreIcon from '../../assets/images/bell.png';
import savedIcon from '../../assets/images/bell.png'; // Add your bookmark/save icon here
import { NavLink } from 'react-router-dom';

const Leftbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const fullName = user?.fullName || "Sayyad Shahi";
  const userId = user?._id || user?.id;

  return (
    <div className={styles.leftbar}>
      
      {/* Profile Section */}
      <div className={styles.profilesection}>
        <div className={styles.profileWrapper}>
          <img src={profile} alt="Profile" className={styles.profileImage} />
        </div>
        <h3 className={styles.username}>{fullName}</h3>
      </div>

      {/* PRIMARY SECTION (The 4 Compulsory Items) */}
      <ul className={styles.navlinks}>
        <li className={styles.listitem}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            <img src={homeIcon} alt="Home" className={styles.icon} />
            <span>Home</span>
          </NavLink>
        </li>

        <li className={styles.listitem}>
          <NavLink to="/myLibrary" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            <img src={libraryIcon} alt="Library" className={styles.icon} />
            <span>My Library</span>
          </NavLink>
        </li>

        <li className={styles.listitem}>
          <NavLink to="/timeline" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            <img src={timelineIcon} alt="Timeline" className={styles.icon} />
            <span>Timeline</span>
          </NavLink>
        </li>

        <li className={styles.listitem}>
          <NavLink to="/explore" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            <img src={exploreIcon} alt="Explore" className={styles.icon} />
            <span>Explore</span>
          </NavLink>
        </li>
      </ul>

      {/* SECONDARY SECTION (Personal/Bookmarks) */}
     {userId && (
        <>
          <div className={styles.divider}></div>
          <ul className={styles.navlinks}>
            <li className={styles.listitem}>
              <NavLink to="/saved" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                <img src={savedIcon} alt="Saved" className={styles.icon} />
                <span className={styles.savedLabel}>Saved Posts</span>
              </NavLink>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Leftbar;