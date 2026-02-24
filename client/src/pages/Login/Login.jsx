import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logo from '../../assets/images/Logo.png'; 
import { useDispatch, useSelector } from 'react-redux';
import { loginuser } from '../../Redux/userSlice/userSlice';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // Get auth state from Redux
    const { isLoading, isError, errorMessage } = useSelector((state) => state.users);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { email, password, rememberMe };
        try {
            await dispatch(loginuser(loginData)).unwrap();
            navigate("/");
        } catch (err) {
            console.error("Login component error:", err);
        }
    };

    return (
        <div className={styles.authWrapper}>
            <div className={styles.loginCard}>
                <header className={styles.authHeader}>
                    <img src={logo} alt="BookSphere Logo" className={styles.formLogo} />
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Log in to continue your reading journey.</p>
                </header>

                {/* --- Display Error Message --- */}
                {isError && (
                    <div className={styles.errorBanner}>
                        {errorMessage || "Invalid email or password"}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formOptions}>
                        <label className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className={styles.checkmark}></span>
                            Remember me
                        </label>

                        <NavLink to="/forgot-password" className={styles.forgotPass}>
                            Forgot Password?
                        </NavLink>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginSubmitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <footer className={styles.authFooter}>
                    <p>
                        Don't have an account? 
                        <NavLink to="/register" className={styles.registerLink}>
                            Register
                        </NavLink>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Login;