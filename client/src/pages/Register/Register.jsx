import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Register.module.css';
import logo from '../../assets/images/logo.png';
import defaultAvatar from '../../assets/images/profile (1).png'; 
import { useDispatch, useSelector } from 'react-redux';
import { registeruser } from '../../Redux/userSlice/userSlice';

const Register = () => {
    // 1. Destructure states from Redux
    const { user, isLoading, isError, errorMessage,registrationSuccess } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    
    // Local state for success message
    const [isSuccess, setIsSuccess] = useState(false);

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(defaultAvatar);

    // 2. Logic to clear fields when user is successfully registered
  useEffect(() => {
    // Only run if registrationSuccess is TRUE
    if (registrationSuccess) {
        setIsSuccess(true);
        
        // Clear all fields
        setFullName('');
        setUsername('');
        setEmail('');
        setGender('');
        setPassword('');
        setConfirmPassword('');
        setAvatar(null);
        setPreview(defaultAvatar);

        // Optional: Reset the success flag in Redux so it doesn't trigger again
        // dispatch(resetSuccessFlag()); 

        const timer = setTimeout(() => setIsSuccess(false), 5000);
        return () => clearTimeout(timer);
    }
}, [registrationSuccess]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file); 
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const data = new FormData();
        data.append('fullName', fullName);
        data.append('username', username);
        data.append('email', email);
        data.append('gender', gender);
        data.append('password', password);
        data.append('confirmPassword', confirmPassword);
        
        if (avatar) {
            data.append('avatar', avatar); 
        }

        dispatch(registeruser(data));
    };

    return (
        <div className={styles.authWrapper}>
            <div className={styles.registerCard}>
                <header className={styles.authHeader}>
                    <img src={logo} alt="Logo" className={styles.formLogo} />
                    <h1 className={styles.title}>Join BookSphere</h1>
                </header>

                {/* --- SUCCESS & ERROR MESSAGES --- */}
                {isSuccess && <p className={styles.successMsg}>🎉 Registration successful! You can now login.</p>}
                {isError && <p className={styles.errorMsg}>❌ {errorMessage || "Something went wrong"}</p>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.avatarUpload}>
                        <div className={styles.avatarPreview}>
                            <img src={preview} alt="Preview" />
                        </div>
                        <label htmlFor="avatarInput" className={styles.uploadLabel}>Change Avatar</label>
                        <input type="file" id="avatarInput" accept="image/*" onChange={handleImageChange} hidden />
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <input type="text" value={fullName} placeholder='sayyad shahi' onChange={(e) => setFullName(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Username</label>
                            <input type="text" value={username} placeholder='sayyadshahi' onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input type="email" value={email} placeholder='sayyadshahi@gmail.com' onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Gender</label>
                        <select className={styles.selectInput} value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input type="password" value={password} placeholder='......' onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Confirm Password</label>
                            <input type="password" value={confirmPassword} placeholder='......' onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className={styles.registerSubmitBtn} disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <footer className={styles.authFooter}>
                    <p>Already a member? <NavLink to="/login" className={styles.loginLink}>Login</NavLink></p>
                </footer>
            </div>
        </div>
    );
};

export default Register;