import React from 'react'
import NavBar from './components/NavBar/NavBar'
import SideBar from './components/SideBar/SideBar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/add'
import List from './pages/List/list'
import Order from './pages/Orders/order'
 import { ToastContainer } from 'react-toastify';
  

const App = () => {

  const url = "http://localhost:8000";
  return (
    <div className='app-container'>
      <NavBar />
      <hr/>
      <div className="main-content">
        <SideBar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Order url={url} />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App