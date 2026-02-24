import React from 'react'
import styles from './LibraryDesktop.module.css'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import Center from '../../components/center/Center'
import CenterLibrary from '../../components/CenterLibrary/CenterLibrary'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const LibraryDesktop = () => {
    const {user,accessToken}=useSelector((state)=>state.users)
    if (!user || !accessToken) {
          return <Navigate to="/login" replace />;
      } 
  return (
<div className={styles.mainContainer}>
      <div className={styles.leftbarContainer}>
        <Leftbar/>
      </div>
      <div className={styles.centerContainer}><CenterLibrary/></div>
      <div className={styles.rightContainer}><Rightbar/></div>
    </div>
  )
}

export default LibraryDesktop