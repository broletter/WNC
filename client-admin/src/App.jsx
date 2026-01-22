import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MyProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={<Main />} />
          </Routes>
        </MyProvider>
      </BrowserRouter>
    );
  }
}

export default App;
