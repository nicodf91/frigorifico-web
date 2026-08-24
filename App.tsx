
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
              <div className="border-b border-amber-700/60 bg-amber-950/60 px-4 py-2 text-center text-xs text-amber-100">
                Demo de portfolio: catálogo y precios ficticios; los pedidos solo se preparan para abrir WhatsApp.
              </div>
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
