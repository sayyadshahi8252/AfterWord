import React from 'react'
import styles from './ExploreMobile.module.css'
import Explorecenter from '../../components/ExploreCenter/Explorecenter'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ExploreMobile = () => {
    const {user,accessToken}=useSelector((state)=>state.users)
    if (!user || !accessToken) {
          return <Navigate to="/login" replace />;
      } 
  return (
       <div className={styles.homeMobileWrapper}>


      <main className={styles.scrollableContent}>
        {/* CenterMobile already handles its internal cards and spacing */}
       <Explorecenter/>
      </main>

      <footer className={styles.footerFixed}>
        <BottomNav/>
      </footer>
    </div>
  )
}

export default ExploreMobile