import { useState } from 'react'
import Home from './component/Home';
import './App.css'
import { Navbar } from './component/Navbar';

function App() {
  const [currentView, setCurrentView] = useState('all');

  return (
    <div className="app-wrapper">
      <Navbar setView={setCurrentView} />
      <main className="main-box">
        <Home view={currentView} />
      </main>
    </div>
  )
}

export default App
