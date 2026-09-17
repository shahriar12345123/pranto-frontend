import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { Categories } from '../pages/Categories';
import { Category } from '../pages/Category';
import { ProductDetails } from '../pages/ProductDetails';
import { Search } from '../pages/Search';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderSuccess } from '../pages/OrderSuccess';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { FAQ } from '../pages/FAQ';
import { ShippingPolicy } from '../pages/ShippingPolicy';
import { ReturnPolicy } from '../pages/ReturnPolicy';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { Terms } from '../pages/Terms';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="search" element={<Search />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success/:orderId" element={<OrderSuccess />} />
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
  );
};
