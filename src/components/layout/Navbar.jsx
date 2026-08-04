import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { navMenu } from "../../data/categories";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import useCartStore from "../../store/useCartStore";
import useWishlistStore from "../../store/useWishlistStore";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-ivory transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container-luxe flex items-center justify-between h-20">
        {/* Mobile menu trigger */}
        <button
          className="lg:hidden text-noir"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Madhu Kadel Jewellery" className="h-14 md:h-16 w-auto max-w-[180px] object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navMenu.map((menu) =>
            menu.direct ? (
              <Link
                key={menu.label}
                to={menu.slug}
                className="text-sm uppercase tracking-wide text-noir hover:text-champagne-dark transition-colors"
              >
                {menu.label}
              </Link>
            ) : (
              <div
                key={menu.label}
                className="h-full flex items-center"
                onMouseEnter={() => setActiveMenu(menu.label)}
              >
                <Link
                  to={"/shop"}
                  className={`text-sm uppercase tracking-wide transition-colors ${
                    activeMenu === menu.label ? "text-champagne-dark" : "text-noir"
                  } hover:text-champagne-dark`}
                >
                  {menu.label}
                </Link>
              </div>
            )
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5 text-noir">
          <button aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={20} />
          </button>
          <Link to="/account" aria-label="Account" className="hidden md:block">
            <User size={20} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="hidden md:block relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart — ab drawer khulega, page navigate nahi hoga */}
          <button aria-label="Cart" className="relative" onClick={openCart}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {activeMenu &&
          navMenu.find((m) => m.label === activeMenu)?.columns && (
            <MegaMenu menu={navMenu.find((m) => m.label === activeMenu)} />
          )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 bg-noir/60 z-[60] flex items-start justify-center pt-32 px-4">
            <div className="bg-ivory w-full max-w-2xl p-6 rounded-sm relative">
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute top-4 right-4 text-noir"
              >
                <X size={20} />
              </button>
              <form onSubmit={handleSearch}>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our site..."
                  className="w-full border-b-2 border-champagne bg-transparent py-3 text-lg outline-none placeholder:text-noir/40"
                />
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}