import React from 'react'
import "./header.css"
import headerImg from '../../assets/header_image.jpg'

const Header = () => {
  return (
    <div className='header' style={{backgroundImage: `url(${headerImg})`}}>
        {/* Dark gradient overlay for better text contrast */}
        <div className='header-overlay'></div>
        
        <div className='header-contents'>
            <span className='header-tag'>About us</span>
            <h2>Order your favorite food here</h2>
            <p>
              Good food, great mood. Discover a world of fresh flavors and delicious meals 
              delivered straight to your doorstep. Satisfy every craving with just a few taps.
            </p>
            <button className='cta-button'>
              <span>View Menu</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
        </div>
    </div>
  )
}

export default Header