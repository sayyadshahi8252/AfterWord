import React from 'react';
import styles from './BottomNav.module.css';
import homeIcon from '../../assets/images/bell.png';
import libraryIcon from '../../assets/images/bell.png';
import timelineIcon from '../../assets/images/bell.png';
import exploreIcon from '../../assets/images/bell.png';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className={styles.bottomNav}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <img src={homeIcon} alt="Home" />
        <span>Home</span>
      </NavLink>

     <NavLink
  to="/myLibrary/currentlyReading"
  className={({ isActive }) =>
    isActive || window.location.pathname.startsWith("/myLibrary")
      ? `${styles.navItem} ${styles.active}`
      : styles.navItem
  }
>
  <img src={libraryIcon} alt="My Library" />
  <span>Library</span>
</NavLink>


      <NavLink 
        to="/timeline" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <img src={timelineIcon} alt="Timeline" />
        <span>Timeline</span>
      </NavLink>

      <NavLink 
        to="/explore" 
        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
      >
        <img src={exploreIcon} alt="Explore" />
        <span>Explore</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;