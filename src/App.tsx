import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import ElectronicsLayout from './components/ElectronicsLayout';
import EnquiryModal from './components/EnquiryModal';
import ElectronicsHome from './pages/ElectronicsHome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Brands from './pages/Brands';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import { Privacy, Terms } from './pages/StaticPages';
import NotFound from './pages/NotFound';
import MyTokens from './pages/MyTokens';
import { CartProvider } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import CategoriesManager from './pages/admin/CategoriesManager';
import BrandsManager from './pages/admin/BrandsManager';
import EnquiriesManager from './pages/admin/EnquiriesManager';
import BookingsManager from './pages/admin/BookingsManager';
import InventoryManager from './pages/admin/InventoryManager';
import CompanyManager from './pages/admin/CompanyManager';
import DocumentsManager from './pages/admin/DocumentsManager';
import SetupGuide from './pages/admin/SetupGuide';
import AppearanceStudio from './pages/admin/AppearanceStudio';
import MediaLibrary from './pages/admin/MediaLibrary';
import UsersManager from './pages/admin/UsersManager';
import ActivityLog from './pages/admin/ActivityLog';
import SiteSettingsManager from './pages/admin/SiteSettingsManager';

export default function App() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryPrefill, setEnquiryPrefill] = useState<{ id: string; name: string; sku?: string } | undefined>();

  const openEnquiryModal = (product?: { id: string; name: string; sku?: string }) => {
    setEnquiryPrefill(product);
    setIsEnquiryModalOpen(true);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <SiteSettingsProvider>
          <CartProvider>
            <HashRouter>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<ProductsManager />} />
                  <Route path="inventory" element={<InventoryManager />} />
                  <Route path="categories" element={<CategoriesManager />} />
                  <Route path="brands" element={<BrandsManager />} />
                  <Route path="enquiries" element={<EnquiriesManager />} />
                  <Route path="bookings" element={<BookingsManager />} />
                  <Route path="documents" element={<DocumentsManager />} />
                  <Route path="company" element={<CompanyManager />} />
                  <Route path="setup" element={<SetupGuide />} />
                  <Route path="appearance" element={<AppearanceStudio />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="users" element={<UsersManager />} />
                  <Route path="activity" element={<ActivityLog />} />
                  <Route path="settings" element={<SiteSettingsManager />} />
                </Route>

                {/* Public Routes */}
                <Route path="*" element={
                  <ElectronicsLayout>
                    <Routes>
                      <Route path="/" element={<ElectronicsHome />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:slug" element={<ProductDetail />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/:slug" element={<CategoryDetail />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/showroom" element={<Contact />} />
                      <Route path="/my-tokens" element={<MyTokens />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ElectronicsLayout>
                } />
              </Routes>
              <CartDrawer />
              <EnquiryModal
                isOpen={isEnquiryModalOpen}
                onClose={() => setIsEnquiryModalOpen(false)}
                prefillProduct={enquiryPrefill}
              />
            </HashRouter>
          </CartProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
