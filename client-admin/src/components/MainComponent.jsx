import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';

class Main extends Component {
  static contextType = MyContext;

  render() {
    // ❌ chưa login → quay về login
    if (this.context.token === '') {
      return <Navigate to="/admin/login" replace />;
    }

    return (
      <div className="body-admin">
        <Menu />
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </div>
    );
  }
}

export default Main;
