import React from 'react'
import Leftbar from '../components/leftbar/leftbar'
import styles from './HomeDesktop.module.css'
import Center from '../components/center/Center'
import Rightbar from '../components/rightbar/Rightbar'
import { Navigate, useNavigate } from 'react-router-dom'
import Login from './Login/Login'
import { useSelector } from 'react-redux'

const HomeDesktop = () => {

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftbarContainer}>
        <Leftbar/>
      </div>
      <div className={styles.centerContainer}><Center/></div>
      <div className={styles.rightContainer}><Rightbar/></div>
    </div>
  )
}

export default HomeDesktop