import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgendarHorario from './Page/AgendarHorario/index.tsx';
import Header from './Components/Header/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/agendar' element={<AgendarHorario />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
