// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ArticleDetail from './components/ArticleDetail';
import AdminLogin from './components/Admin/AdminLogin';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/change-password" element={<ChangePassword />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;