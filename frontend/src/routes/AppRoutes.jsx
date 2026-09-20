import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

// Helper for lazy loading named exports
const lazyPage = (importFn, exportName) =>
  lazy(() => importFn().then((mod) => ({ default: mod[exportName] })));

// Lazy-loaded route components for performance optimization & smaller initial bundle size
const Home = lazyPage(() => import('../pages/Home'), 'Home');
const Shop = lazyPage(() => import('../pages/Shop'), 'Shop');
const Categories = lazyPage(() => import('../pages/Categories'), 'Categories');
const Category = lazyPage(() => import('../pages/Category'), 'Category');
const ProductDetails = lazyPage(() => import('../pages/ProductDetails'), 'ProductDetails');
const Search = lazyPage(() => import('../pages/Search'), 'Search');
const Cart = lazyPage(() => import('../pages/Cart'), 'Cart');
const Checkout = lazyPage(() => import('../pages/Checkout'), 'Checkout');
const OrderSuccess = lazyPage(() => import('../pages/OrderSuccess'), 'OrderSuccess');
const About = lazyPage(() => import('../pages/About'), 'About');
const Contact = lazyPage(() => import('../pages/Contact'), 'Contact');
const FAQ = lazyPage(() => import('../pages/FAQ'), 'FAQ');
const ShippingPolicy = lazyPage(() => import('../pages/ShippingPolicy'), 'ShippingPolicy');
const ReturnPolicy = lazyPage(() => import('../pages/ReturnPolicy'), 'ReturnPolicy');
const PrivacyPolicy = lazyPage(() => import('../pages/PrivacyPolicy'), 'PrivacyPolicy');
const Terms = lazyPage(() => import('../pages/Terms'), 'Terms');
const SignIn = lazyPage(() => import('../pages/SignIn'), 'SignIn');
const SignUp = lazyPage(() => import('../pages/SignUp'), 'SignUp');
const Profile = lazyPage(() => import('../pages/Profile'), 'Profile');
const NotFound = lazyPage(() => import('../pages/NotFound'), 'NotFound');

const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="w-9 h-9 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="product/id/:id" element={<ProductDetails />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="login" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="register" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Profile />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="order-success/id/:id" element={<OrderSuccess />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="return-policy" element={<ReturnPolicy />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
