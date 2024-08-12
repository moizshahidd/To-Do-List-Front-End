import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './MainPage'
import SignUP from './SignUP'
import Events from './Events'
import Login from './Login'
import UpdateUser from './UpdateUser'
import UpdateEvent from './UpdateEvent'
import UpdateList from './UpdateList'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/SignUP' element={<SignUP />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/UpdateUser' element={<UpdateUser />} />
        <Route path='/Events' element={<Events />} />
        <Route path='/UpdateEvent' element={<UpdateEvent />} />
        <Route path='/UpdateList' element={<UpdateList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
