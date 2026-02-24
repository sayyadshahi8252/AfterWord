import React from 'react';
import styles from './searchbar.module.css'; 
import searchicon from '../../assets/images/find.png';

const Searchbar = () => {
  return (
    <div className={styles['search-container']}>
      <span className={styles['search-icon']}>
        <img src={searchicon} alt="search" className={styles['icon-image']} />
      </span>
      <input 
        type="text" 
        className={styles['search-input']} 
        placeholder="Search" 
      />
    </div>
  );
};

export default Searchbar;