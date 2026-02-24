import React from 'react'
import styles from "./SavedMobile.module.css"
import HeaderMobile from '../../components/Header/HeaderMobile'
import BottomNav from '../../components/BottomNav/BottomNav'
import SavedCenter from '../../components/savedcenter/SavedCenter'

const SavedMobile = () => {
  return (
     <div className={styles.homeMobileWrapper}>
     
    
          <main className={styles.scrollableContent}>
            {/* CenterMobile already handles its internal cards and spacing */}
           <SavedCenter/>
          </main>

    
          <footer className={styles.footerFixed}>
            <BottomNav />
          </footer>
        </div>
  )
}

export default SavedMobile