import React from 'react'
import styles from './HeaderDesktop.module.css'
import logo from '../../assets/images/Logo.png'
import Searchbar from '../searchbar/searchbar'
import bellicon from '../../assets/images/bell.png'
import profileImg from '../../assets/images/profile (1).png'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../Redux/userSlice/userSlice'

const HeaderDesktop = () => {
    const { accessToken } = useSelector((state) => state.users)
    const dispatch = useDispatch()
    return (
        <div className={styles.mainContainer}>
            <div className={styles.firtstContainer}>
                <div className={styles.logodetail}>
                    <NavLink to="/" className={styles.logoLink}>
                        <img src={logo} alt="Logo" />
                        <h2 className={styles.headerTitle}>AfterWord</h2>
                    </NavLink>
                </div>
                <ul className={styles.ul}>
                    <li className={styles.li}>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                            end
                        >
                            Home
                        </NavLink>
                    </li>

                    <li className={styles.li}>
                        <NavLink
                            to="/myLibrary"
                            className={({ isActive }) =>
                                // Active if on /myLibrary or any of its sub-routes
                                isActive || window.location.pathname.startsWith("/myLibrary")
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            Library
                        </NavLink>
                    </li>

                    <li className={styles.li}>
                        <NavLink
                            to="/timeline"
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            Timeline
                        </NavLink>
                    </li>

                    <li className={styles.li}>
                        <NavLink
                            to="/explore"
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            Explore
                        </NavLink>
                    </li>
                </ul>


            </div>
            <div className={styles.secondContainer}>
                <Searchbar />
                <div className={styles[ 'icon-wrapper' ]}>
                    <img src={bellicon} alt="notification bell" className={styles[ 'nav-icon' ]} />
                </div>

                {/* --- ADDED LOGIN BUTTON --- */}
                {/* <NavLink to="/login" className={styles.loginBtn}>
                    Login
                </NavLink> */}
                {accessToken ?
                    <NavLink onClick={() => dispatch(logout())} className={styles.loginBtn}>
                        Logout
                    </NavLink>
                    :
                    <NavLink to="/login" className={styles.loginBtn}>
                        Login
                    </NavLink>
                }

                <div className={styles[ 'profile-wrapper' ]}>
                    <img src={profileImg} alt="User Profile" className={styles[ 'round-image' ]} />
                </div>
            </div>
        </div>
    )
}

export default HeaderDesktop;