import { useState } from 'react'
import './App.css'
import HeaderDesktop from './components/Header/HeaderDesktop'
import HeaderMobile from './components/Header/HeaderMobile'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/HomeDesktop'
import HomeDesktop from './pages/HomeDesktop'
import HomeMobile from './pages/HomeMobile'
import LibraryDesktop from './pages/MyLibrary/LibraryDesktop'
import Currentlyreading from './pages/MyLibrary/currentlyReading/Currentlyreading'
import WatchList from './pages/MyLibrary/watchlist/WatchList'
import Completed from './pages/MyLibrary/completed/Completed'
import LibraryMobile from './pages/MyLibrary/LibraryMobile'
import ReadingStats from './components/ReadingStats/ReadingStats'
import ExploreDesktop from './pages/Explore/ExploreDesktop'
import ExploreMobile from './pages/Explore/ExploreMobile'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Saved from './pages/saved/Saved'
import SavedMobile from './pages/saved/SavedMobile'
function App() {
  return (
    <>
      {/* Headers */}
      <div className="desktop-header-only">
        <HeaderDesktop />
      </div>
      <div className="mobile-header-only">
        <HeaderMobile />
      </div>

      {/* Main content */}
      <div className="main-content">
        <Routes>
          <Route path='/' element={
            <>
              <div className="desktop-header-only">
                <HomeDesktop />
              </div>
              <div className="mobile-header-only">
                <HomeMobile />
              </div>
            </>
          } />

          <Route path='/myLibrary' element={
            <>
              <div className="desktop-header-only">
                <LibraryDesktop />
              </div>
              <div className="mobile-header-only">
                <LibraryMobile />
              </div>
            </>
          }>
            <Route index element={<Currentlyreading />} />
            <Route path='currentlyReading' element={<Currentlyreading />} />
            <Route path='watchList' element={<WatchList />} />
            <Route path='completed' element={<Completed />} />
            <Route path='readingstats' element={<ReadingStats />} />
          </Route>

          <Route path='/explore' element={
            <>
              <div className="desktop-header-only">
                <ExploreDesktop />
              </div>
              <div className="mobile-header-only">
                <ExploreMobile />
              </div>
            </>
          } />

   <Route path='/saved' element={
            <>
              <div className="desktop-header-only">
                <Saved/>
              </div>
              <div className="mobile-header-only">
               <SavedMobile/>
              </div>
            </>
          } />
          

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App