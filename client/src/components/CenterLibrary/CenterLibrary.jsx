// CenterLibrary.jsx
import { NavLink, Outlet } from 'react-router-dom';
import styles from './CenterLibrary.module.css';

const CenterLibrary = () => {
    return (
        <div className={styles.centerWrapper}>
            <h1 className={styles.mainTitle}>My Library</h1>
            <p className={styles.subQuote}>"A room without books is like a body without a soul"</p>

            <div className={styles.tabNav}>
                <NavLink
                    to='currentlyReading'
                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                    Currently Reading 
                </NavLink>
                <NavLink
                    to='watchList'
                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                    Watchlist
                </NavLink>
                <NavLink
                    to='completed'
                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                    Completed
                </NavLink>
                <NavLink
                    to='readingstats'
                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                    Insights
                </NavLink>
            </div>

            <div className={styles.contentArea}>
                <Outlet />
            </div>
        </div>
    );
};
export default CenterLibrary