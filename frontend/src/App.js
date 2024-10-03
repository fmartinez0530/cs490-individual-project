import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index'
import Customers from './pages/Customers';
import Films from './pages/Films';
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/films' element={<Films />} />
      </Routes>
    </Router>
  )
}

export default App;
