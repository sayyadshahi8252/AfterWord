import React from 'react'
import HeaderMobile from '../../components/Header/HeaderMobile'
import BottomNav from '../../components/BottomNav/BottomNav'
import CenterLibrary from '../../components/CenterLibrary/CenterLibrary'
import styles from './LibraryMobile.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { currentlyreading } from '../../Redux/bookSlice/bookSlice'
import { Navigate } from 'react-router-dom'

const LibraryMobile = () => {
  const {user,accessToken}=useSelector((state)=>state.users)
  if (!user || !accessToken) {
        return <Navigate to="/login" replace />;
    }
 
  return (
    <div className={styles.homeMobileWrapper}>
      {/* <header className={styles.headerFixed}>
       <HeaderMobile/>
      </header> */}

      <main className={styles.scrollableContent}>
        {/* CenterMobile already handles its internal cards and spacing */}
        <CenterLibrary />
      </main>

      <footer className={styles.footerFixed}>
        <BottomNav />
      </footer>
    </div>
  )
}

export default LibraryMobile