import React, { useContext } from 'react'
import "./placeorder.css"
import { StoreContext } from '../../context/StoreContext'

const PlaceOrder = () => {
  const {getTotalCartAmount} = useContext(StoreContext)
  
  return (
    <form className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        
        <div className="multi-fields">
          <input type="text" placeholder='First Name' required />
          <input type="text" placeholder='Last Name' required />
        </div>
        
        <input type="email" placeholder='Email Address' required />
        <input type="text" placeholder='Street' required />
        
        <div className="multi-fields">
          <input type="text" placeholder='City' required />
          <input type="text" placeholder='State' required />
        </div>
        
        <div className="multi-fields">
          <input type="text" placeholder='Zip Code' required />
          <input type="text" placeholder='Country' required />
        </div>
        
        <input type="tel" placeholder='Phone Number' required />
      </div>

      <div className="place-order-right">
        <h2>Order Summary</h2>
        
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getTotalCartAmount()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>${getTotalCartAmount() === 0 ? 0 : 2}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</span>
          </div>
        </div>
        
        <button type="submit">PROCEED TO PAYMENT</button>
      </div>
    </form>
  )
}

export default PlaceOrder