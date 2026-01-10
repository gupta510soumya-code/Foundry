
import { useState } from 'react'
import Home from './component/Home';
import './App.css'
import { Navbar } from './component/Navbar';
// import { Auth } from './component/Auth';

function App() {

  return (
    <>
    <div>
      <Navbar/>
      {/* <Auth/> */}
      <main>
        <Home/>
      </main>
    </div>
    </>
  )
}

export default App
