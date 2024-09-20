import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import BlogsPage from './Blogs'; 
import Users from './Users';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BlogsPage />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
