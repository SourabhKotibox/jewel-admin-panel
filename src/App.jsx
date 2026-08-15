import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CollectionRedirect from "./pages/CollectionRedirect";
import ProductDetail from "./pages/ProductDetail";
import Stores from "./pages/Stores";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import ThankYou from "./pages/ThankYou";
import Account from "./components/layout/Account";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FaqPage from "./pages/Faq";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ShopFilter from "./pages/ShopFilter";
import CmsContentPage from "./pages/CmsContentPage";
import ResetPassword from "./pages/ResetPassword";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import ProductForm from "./admin/pages/ProductForm";
import Orders from "./admin/pages/Orders";
import OrderDetail from "./admin/pages/OrderDetail";
import OrderSupport from "./admin/pages/OrderSupport";
import Categories from "./admin/pages/Categories";
import Customers from "./admin/pages/Customers";
import AdminStores from "./admin/pages/AdminStores";
import AdminTestimonials from "./admin/pages/AdminTestimonials";
import Settings from "./admin/pages/Settings";
import MarketRates from "./admin/pages/MarketRates";
import PageContent from "./admin/pages/PageContent";
import BusinessSettings from "./admin/pages/BusinessSettings";
import { Credentials, MailSettings } from "./admin/pages/CredentialsAndMail";
import AdminLogin from "./admin/pages/AdminLogin";
import RequireAuth from "./admin/RequireAuth";
import EntityFormPage from "./admin/pages/EntityFormPage";
import {
  DynamicPages,
  MediaLibrary,
  Themes,
  FaqsAdmin,
  BlogAdmin,
  Taxes,
  Roles,
} from "./admin/pages/ExtraPages";
import Reports from "./admin/pages/Reports";
import {
  Invoices,
  Shipments,
  Refunds,
  Transactions,
  Attributes,
  Inventory,
  Coupons,
  Campaigns,
  Reviews,
  Newsletter,
  StaticPages,
  AdminUsers,
} from "./admin/pages/BagistoPages";
import JewelryTypes from "./admin/pages/JewelryTypes";

const entityFormRoutes = [
  "inventory",
  "invoices",
  "shipments",
  "refunds",
  "transactions",
  "attributes",
  "customers",
  "coupons",
  "campaigns",
  "reviews",
  "newsletter",
  "cms-pages",
  "dynamic-pages",
  "faqs",
  "blog",
  "taxes",
  "roles",
  "users",
  "categories",
  "stores",
  "testimonials",
  "media",
  "jewelry-types",
];

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Layout>
        <main className="flex-1">
          <Outlet />
        </main>
      </Layout>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="market-rates" element={<MarketRates />} />
        <Route path="categories" element={<Categories />} />
        <Route path="jewelry-types" element={<JewelryTypes />} />
        <Route path="attributes" element={<Attributes />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<EntityFormPage entityKey="orders" />} />
        <Route path="orders/:id/edit" element={<EntityFormPage entityKey="orders" />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="order-support" element={<OrderSupport />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="returns" element={<OrderSupport />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="page-content" element={<PageContent />} />
        <Route path="dynamic-pages" element={<DynamicPages />} />
        <Route path="cms-pages" element={<StaticPages />} />
        <Route path="blog" element={<BlogAdmin />} />
        <Route path="faqs" element={<FaqsAdmin />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="themes" element={<Themes />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="business" element={<BusinessSettings />} />
        <Route path="settings" element={<Settings />} />
        <Route path="mail" element={<MailSettings />} />
        <Route path="credentials" element={<Credentials />} />
        <Route path="taxes" element={<Taxes />} />
        <Route path="roles" element={<Roles />} />
        <Route path="users" element={<AdminUsers />} />

        {entityFormRoutes.map((key) => (
          <Route
            key={`${key}-new`}
            path={`${key}/new`}
            element={<EntityFormPage entityKey={key} />}
          />
        ))}
        {entityFormRoutes.map((key) => (
          <Route
            key={`${key}-id`}
            path={`${key}/:id`}
            element={<EntityFormPage entityKey={key} />}
          />
        ))}
      </Route>

      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopFilter />} />
        <Route path="/pages/:slug" element={<CmsContentPage />} />
        <Route path="/collections/:slug" element={<CollectionRedirect />} />
        <Route path="/collections" element={<CollectionRedirect />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Account />} />
        <Route path="/register" element={<Account />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>
    </Routes>
  );
}

export default App;
