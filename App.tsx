
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StateProvider } from './services/state';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BranchSelector } from './pages/BranchSelector';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';

const App: React.FC = () => {
  return (
    <StateProvider>
      <HashRouter>
        <Routes>
          <Route path="/sucursales/seleccionar" element={<BranchSelector />} />
          
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Catalog />} />
                <Route path="/productos/:id" element={<ProductDetail />} />
                <Route path="/sucursales" element={<BranchSelector />} /> 
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </HashRouter>
    </StateProvider>
  );
};

export default App;
