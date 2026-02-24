import React from 'react';
import styles from './HeaderMobile.module.css';
import logo from '../../assets/images/logo.png';
import searchicon from '../../assets/images/find.png';
import bellicon from '../../assets/images/bell.png';
import profileImg from '../../assets/images/profile (1).png';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/userSlice/userSlice';

const HeaderMobile = () => {
  const { user, accessToken } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topRow}>
        {/* Logo Section */}
        <NavLink to="/" className={styles.logoSection}>
          <img src={logo} alt="BookSphere Logo" className={styles.logoImage} />
          <span className={styles.logoText}>AfterWord</span>
        </NavLink>

        {/* Action Icons */}
        <div className={styles.actionIcons}>
          <div className={styles.notificationWrapper}>
            <img src={bellicon} alt="Notifications" className={styles.bellIcon} />
            <span className={styles.badge}></span>
          </div>

          {/* Login/Logout Button */}
          {accessToken ? (
            <button
              onClick={() => dispatch(logout())}
              className={styles.loginBtn}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={styles.loginBtn}>
              Login
            </NavLink>
          )}

          <img src={profileImg} alt="Profile" className={styles.profileImage} />
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchContainer}>
          <img src={searchicon} alt="Search" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search books, authors..."
            className={styles.searchInput}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
