import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProductListing from './pages/produtListing';
import ProductDetailsPage from "./pages/prodcutDetailPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/header"
function App() {
  return (
    <>        <Header />

      <Router>
        <Routes>
          <Route path="/" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
