import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import Routes from '../routes/routes';

// import 'react-dates/initialize';
// import 'react-dates/lib/css/_datepicker.css';

function App() {
  return (
    <Router>
      <Routes></Routes>
    </Router>
  );
}

export default App;


