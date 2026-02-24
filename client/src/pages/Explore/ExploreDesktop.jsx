import React from 'react'
import styles from './ExploreDesktop.module.css'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import Explorecenter from '../../components/ExploreCenter/Explorecenter'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Login from '../Login/Login'

const ExploreDesktop = () => {
  const {user,accessToken}=useSelector((state)=>state.users)
  if (!user || !accessToken) {
        return <Navigate to="/login" replace />;
    }
  return (
     <div className={styles.mainContainer}>
      <div className={styles.leftbarContainer}>
       <Leftbar/>
      </div>
      <div className={styles.centerContainer}><Explorecenter/></div>
      <div className={styles.rightContainer}><Rightbar/></div>
    </div>
  )
}

export default ExploreDesktop