import React from 'react'
import styles from "./saved.module.css"
import Leftbar from '../../components/leftbar/leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import SavedCenter from '../../components/savedcenter/SavedCenter'

const Saved = () => {
  return (
    <div className={styles.mainContainer}>
         <div className={styles.leftbarContainer}>
           <Leftbar/>
         </div>
         <div className={styles.centerContainer}><SavedCenter/></div>
         <div className={styles.rightContainer}><Rightbar/></div>
       </div>
  )
}

export default Saved