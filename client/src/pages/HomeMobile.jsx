import React from 'react';
import styles from './HomeMobile.module.css';
import HeaderMobile from '../components/Header/HeaderMobile';
import CenterMobile from '../components/center/CenterMobile';
import BottomNav from '../components/BottomNav/BottomNav';

const HomeMobile = () => {
  return (
    <div className={styles.homeMobileWrapper}>
      <header className={styles.headerFixed}>
        <HeaderMobile />
      </header>

      <main className={styles.scrollableContent}>
        {/* CenterMobile already handles its internal cards and spacing */}
        <CenterMobile />
      </main>

      <footer className={styles.footerFixed}>
        <BottomNav />
      </footer>
    </div>
  );
};

export default HomeMobile;