import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgendarHorario from './Page/AgendarHorario/index.tsx';
import Header from './Components/Header/index.tsx';
import { SnackbarProvider, useSnackbar } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/agendar' element={<AgendarHorario />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  </React.StrictMode>,
)
