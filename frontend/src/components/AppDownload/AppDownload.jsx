import React from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>for best experience download the app<br/>Amal App</p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="playstore" />
            <img src={assets.app_store} alt="appstore" />
        </div>
    </div>
  )
}

export default AppDownload