import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useCartStore from "../store/useCartStore";
import useWishlistStore from "../store/useWishlistStore";
import { navMenu as fallbackNav } from "../data";
import logoFallback from "../assets/images/logo.png";
import CartDrawer from "./layout/CartDrawer";
import CmsCustomBlock from "./CmsCustomBlock";
import useCmsStore from "../store/useCmsStore";
import useSettingsStore, { resolveLogo } from "../store/useSettingsStore";
import { api, assetUrl } from "../api/client";
import { shopPath, toShopHref } from "../utils/shopLinks";

import {
  cmsLayoutToFields,
  fieldsToCmsLayout,
  defaultLayoutFields,
  defaultLayoutSectionLayout,
  extractLayoutSectionLayout,
  normalizeLayoutSectionLayout,
  isLayoutSectionHidden,
  parseNavMenu,
  parseLinkLines,
} from "../admin/data/layoutCmsFields";

function useLayoutCms() {
  const fields = useCmsStore((s) => s.pages.footer?.fields) || defaultLayoutFields;
  const sectionLayout = useCmsStore((s) => s.pages.footer?.sectionLayout);
  const updatePageFields = useCmsStore((s) => s.updatePageFields);
  const setPageSectionLayout = useCmsStore((s) => s.setPageSectionLayout);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await api("/settings");
        if (cancelled || !settings.cmsLayout) return;
        updatePageFields("footer", cmsLayoutToFields(settings.cmsLayout));
        setPageSectionLayout("footer", extractLayoutSectionLayout(settings.cmsLayout));
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [updatePageFields, setPageSectionLayout]);

  const layout = useMemo(
    () => fieldsToCmsLayout(fields, sectionLayout || defaultLayoutSectionLayout),
    [fields, sectionLayout]
  );
  const sectionL = useMemo(
    () => normalizeLayoutSectionLayout(sectionLayout || defaultLayoutSectionLayout),
    [sectionLayout]
  );
  return useMemo(
    () => ({
      ...layout,
      sectionLayout: sectionL,
      isHidden: (id) => isLayoutSectionHidden(sectionL, id),
    }),
    [layout, sectionL]
  );
}

function AnnouncementBar({ messages }) {
  const list = (messages || []).filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!list.length) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 3500);
    return () => clearInterval(id);
  }, [list.length]);

  if (!list.length) return null;

  return (
    <div className="bg-noir text-champagne-light h-9 flex items-center justify-center overflow-hidden text-xs md:text-[13px] tracking-wide px-4">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-center truncate"
        >
          {list[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function MegaMenu({ menu, discoverLabel, collectionSuffix, onClose }) {
  if (!menu?.columns) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-0 top-full w-full bg-ivory border-t border-champagne/20 shadow-2xl z-50"
    >
      <div className="container-luxe grid grid-cols-4 gap-10 py-10">
        <div className="col-span-3 grid grid-cols-3 gap-10">
          {menu.columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-noir font-display text-lg mb-4 pb-2 border-b border-champagne/30">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {(col.items || []).map((item) => (
                  <li key={item}>
                    <Link
                      to={shopPath(item)}
                      onClick={onClose}
                      className="text-sm text-noir/70 hover:text-champagne-dark transition-colors link-underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link to={shopPath(menu.slug)} onClick={onClose} className="relative group overflow-hidden rounded-sm block h-56">
          {menu.featuredImage ? (
            <img
              src={assetUrl(menu.featuredImage)}
              alt={menu.label}
              className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-stone-200 shimmer-bg flex items-center justify-center">
              <span className="eyebrow z-10">{menu.label}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-noir-fade opacity-85" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
            <span className="text-[10px] uppercase tracking-widest2 text-champagne mb-1">
              {discoverLabel}
            </span>
            <span className="text-ivory font-display text-xl">
              {menu.label} {collectionSuffix}
            </span>
          </div>
          <div className="absolute inset-4 border border-champagne/20 scale-95 group-hover:scale-100 transition-transform duration-500 pointer-events-none" />
        </Link>
      </div>
    </motion.div>
  );
}

function MobileMenu({ open, onClose, menu }) {
  const [expanded, setExpanded] = useState(null);
  const storeLogo = resolveLogo(useSettingsStore((s) => s.business?.storefrontLogo)) || logoFallback;
  const items = menu?.length ? menu : fallbackNav;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir/50 z-[70]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-ivory z-[80] overflow-y-auto rounded-r-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-champagne/20">
              <img src={storeLogo} alt="Madhu logo" className="h-12 w-auto object-contain" />
              <button onClick={onClose} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
             <div className="p-5 space-y-1">
               <Link
                 to="/shop"
                 className="block py-4 text-sm uppercase tracking-wide border-b border-champagne/10 text-champagne-dark font-medium"
               >
                 Shop / Filter
               </Link>
              {items.map((m) => (
                <div key={m.label} className="border-b border-champagne/10">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between py-4 text-sm uppercase tracking-wide"
                    onClick={() =>
                      m.direct
                        ? navigate(toShopHref(m.slug))
                        : setExpanded(expanded === m.label ? null : m.label)
                    }
                  >
                    {m.label}
                    {!m.direct && (
                      <span className={`transition-transform ${expanded === m.label ? "rotate-90" : ""}`}>
                        ▶
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {expanded === m.label && m.columns && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 pb-3"
                      >
                        {m.columns.map((col) => (
                          <div key={col.heading} className="mb-3">
                            <p className="text-xs font-semibold text-champagne-dark mb-1.5">{col.heading}</p>
                            {(col.items || []).map((item) => (
                              <Link
                                key={item}
                                to={shopPath(item)}
                                className="block text-sm text-noir/70 py-1.5"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Footer({ layout }) {
  const business = useSettingsStore((s) => s.business);
  const socials = business.socials || {};
  const [email, setEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState("");
  const [joinErr, setJoinErr] = useState("");
  const shopLinks = layout.shopLinks?.length
    ? layout.shopLinks
    : parseLinkLines(defaultLayoutFields.shopLinksText);
  const exploreLinks = layout.exploreLinks?.length
    ? layout.exploreLinks
    : parseLinkLines(defaultLayoutFields.exploreLinksText);
  let moreLinks = layout.moreLinks?.length
    ? layout.moreLinks
    : parseLinkLines(defaultLayoutFields.moreLinksText);
  // Ensure Contact Us + Track Order are always available in footer More column
  if (!moreLinks.some((l) => String(l.path || "").includes("/contact"))) {
    const aboutIdx = moreLinks.findIndex((l) => String(l.path || "").includes("/about"));
    const contactLink = { label: "Contact Us", path: "/contact" };
    moreLinks =
      aboutIdx >= 0
        ? [
            ...moreLinks.slice(0, aboutIdx + 1),
            contactLink,
            ...moreLinks.slice(aboutIdx + 1),
          ]
        : [contactLink, ...moreLinks];
  }
  if (!moreLinks.some((l) => String(l.path || "").includes("/track-order"))) {
    const contactIdx = moreLinks.findIndex((l) => String(l.path || "").includes("/contact"));
    const trackLink = { label: "Track Order", path: "/track-order" };
    moreLinks =
      contactIdx >= 0
        ? [
            ...moreLinks.slice(0, contactIdx + 1),
            trackLink,
            ...moreLinks.slice(contactIdx + 1),
          ]
        : [...moreLinks, trackLink];
  }
  // Always surface FAQs + Blog journal in the More column
  if (!moreLinks.some((l) => String(l.path || "") === "/faq" || /faq/i.test(l.label || ""))) {
    moreLinks = [...moreLinks, { label: "FAQs", path: "/faq" }];
  }
  if (
    !moreLinks.some(
      (l) =>
        String(l.path || "") === "/blog" ||
        /blog|journal/i.test(l.label || "")
    )
  ) {
    moreLinks = [...moreLinks, { label: "Blog", path: "/blog" }];
  }
  // Keep legal links on CMS pages (older CMS layouts pointed both at /about)
  moreLinks = moreLinks.map((l) => {
    const label = String(l.label || "");
    const path = String(l.path || "");
    if (/terms/i.test(label) && (path === "/about" || !path.startsWith("/pages/"))) {
      return { ...l, path: "/pages/terms-conditions" };
    }
    if (/privacy/i.test(label) && (path === "/about" || !path.startsWith("/pages/"))) {
      return { ...l, path: "/pages/privacy-policy" };
    }
    return l;
  });
  if (!moreLinks.some((l) => /terms/i.test(l.label || "") || String(l.path || "").includes("terms"))) {
    moreLinks = [...moreLinks, { label: "Terms & Conditions", path: "/pages/terms-conditions" }];
  }
  if (!moreLinks.some((l) => /privacy/i.test(l.label || "") || String(l.path || "").includes("privacy"))) {
    moreLinks = [...moreLinks, { label: "Privacy Policy", path: "/pages/privacy-policy" }];
  }

  const onJoin = async (e) => {
    e.preventDefault();
    setJoinMsg("");
    setJoinErr("");
    const value = email.trim();
    if (!value) {
      setJoinErr("Please enter your email");
      return;
    }
    setJoining(true);
    try {
      const res = await api("/newsletter/subscribe", {
        method: "POST",
        body: { email: value },
        portal: "user",
      });
      setJoinMsg(res.message || "Thank you for joining!");
      setEmail("");
    } catch (err) {
      setJoinErr(err.message || "Could not subscribe. Try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <footer className="bg-noir text-ivory/80">
      <div className="container-luxe py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div>
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">
            {layout.shopHeading}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link to={toShopHref(l.path)} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">
            {layout.exploreHeading}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.label}>
                <Link to={toShopHref(l.path)} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">
            {layout.moreHeading}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {moreLinks.map((l) => (
              <li key={l.label}>
                <Link to={toShopHref(l.path)} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">
            {layout.benefitsHeading}
          </h4>
          <p className="text-sm mb-4 text-ivory/60">{layout.benefitsText}</p>
          <form className="flex border-b border-champagne/40 pb-2 mb-2" onSubmit={onJoin}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={layout.emailPlaceholder}
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-ivory/40"
              disabled={joining}
              aria-label="Email for membership"
            />
            <button
              type="submit"
              disabled={joining}
              className="text-champagne text-sm uppercase tracking-wide disabled:opacity-50 shrink-0"
            >
              {joining ? "…" : layout.joinCta}
            </button>
          </form>
          {joinMsg ? <p className="text-xs text-champagne mb-4">{joinMsg}</p> : null}
          {joinErr ? <p className="text-xs text-rose-400 mb-4">{joinErr}</p> : null}
          {!joinMsg && !joinErr ? <div className="mb-4" /> : null}
          <div className="flex gap-4">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} className="hover:text-champagne" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} className="hover:text-champagne" />
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={20} className="hover:text-champagne" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-champagne/10 py-5">
        <p className="text-center text-xs text-ivory/40 tracking-wide">
          © {new Date().getFullYear()} {business.legalName || layout.copyright}
        </p>
      </div>
    </footer>
  );
}

function WhatsAppFloat({ label }) {
  const business = useSettingsStore((s) => s.business);
  const href = `https://api.whatsapp.com/send?phone=${business.whatsapp}&text=${encodeURIComponent(business.whatsappMessage || "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <span className="sr-only">{label}</span>
      <MessageCircle size={20} />
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </a>
  );
}

export default function Layout({ children }) {
  const layout = useLayoutCms();
  const menu = layout.navMenu?.length ? layout.navMenu : parseNavMenu(defaultLayoutFields.navMenuJson);
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((s) => s.items.length);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const navigate = useNavigate();
  const business = useSettingsStore((s) => s.business) || {};
  const updateBusiness = useSettingsStore((s) => s.updateBusiness);
  const storeLogo = resolveLogo(business.storefrontLogo) || logoFallback;
  const logoH = business.storefrontLogoHeight || 88;
  const logoMobileH = business.storefrontLogoMobileHeight || 72;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await api("/settings");
        if (cancelled) return;
        if (settings.business) updateBusiness(settings.business);
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [updateBusiness]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showAnnouncement = !layout.isHidden?.("announcement");
  const showNav = !layout.isHidden?.("nav");
  const showFooter = !layout.isHidden?.("footer");
  const customBlocks = (layout.sectionLayout?.customSections || []).filter(
    (c) => c.enabled !== false
  );

  return (
    <>
      {showAnnouncement && (
        <AnnouncementBar
          messages={[layout.announcement1, layout.announcement2, layout.announcement3]}
        />
      )}
      {showNav && (
      <header
        className={`sticky top-0 z-50 bg-ivory transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="container-luxe flex items-center justify-between h-20">
          <button
            type="button"
            className="lg:hidden text-noir"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center -ml-4 md:-ml-8">
            <img
              src={storeLogo}
              alt={business.businessName || "Madhu Jewellery"}
              style={{ height: `${logoMobileH}px` }}
              className="w-auto max-w-[280px] object-contain md:hidden"
              onError={(e) => {
                e.currentTarget.src = logoFallback;
              }}
            />
            <img
              src={storeLogo}
              alt={business.businessName || "Madhu Jewellery"}
              style={{ height: `${logoH}px` }}
              className="w-auto max-w-[320px] object-contain hidden md:block"
              onError={(e) => {
                e.currentTarget.src = logoFallback;
              }}
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link
              to="/shop"
              className="text-sm uppercase tracking-wide text-noir hover:text-champagne-dark transition-colors"
            >
              Shop
            </Link>
            {menu.map((m) =>
              m.direct ? (
                <Link
                  key={m.label}
                  to={toShopHref(m.slug)}
                  className="text-sm uppercase tracking-wide text-noir hover:text-champagne-dark transition-colors"
                >
                  {m.label}
                </Link>
              ) : (
                <div
                  key={m.label}
                  className="h-full flex items-center"
                  onMouseEnter={() => setActiveMenu(m.label)}
                >
                  <Link
                    to={shopPath(m.slug || m.label)}
                    className={`text-sm uppercase tracking-wide transition-colors ${
                      activeMenu === m.label ? "text-champagne-dark" : "text-noir"
                    } hover:text-champagne-dark`}
                  >
                    {m.label}
                  </Link>
                </div>
              )
            )}
          </nav>

          <div className="flex items-center gap-5 text-noir">
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>
            <Link to="/account" aria-label="Account" className="hidden md:block">
              <User size={20} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="hidden md:block relative">
              <Heart size={20} className={wishlistCount > 0 ? "fill-maroon text-maroon" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-champagne text-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu && (
            <MegaMenu
              menu={menu.find((m) => m.label === activeMenu)}
              discoverLabel={layout.megaDiscoverLabel}
              collectionSuffix={layout.megaCollectionSuffix}
              onClose={() => setActiveMenu(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {searchOpen && (
            <div
              className="fixed inset-0 bg-noir/60 z-[60] flex items-start justify-center pt-32 px-4"
              onClick={() => setSearchOpen(false)}
            >
              <div
                className="bg-ivory w-full max-w-2xl p-6 rounded-sm relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute top-4 right-4 text-noir"
                >
                  <X size={20} />
                </button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = searchQuery.trim();
                    if (!trimmed) return;
                    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="space-y-4"
                >
                  <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Search</p>
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={layout.searchPlaceholder || "Search jewellery, celebs, SKU…"}
                    className="w-full border-b-2 border-champagne bg-transparent py-3 text-lg outline-none placeholder:text-noir/40"
                  />
                  <button type="submit" className="btn-gold w-full sm:w-auto !py-3">
                    Search
                  </button>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>

        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} menu={menu} />
      </header>
      )}
      {children}
      {customBlocks.map((c) => (
        <CmsCustomBlock key={c.id} data={c} />
      ))}
      <WhatsAppFloat label={layout.whatsappText} />
      <CartDrawer />
      {showFooter && <Footer layout={layout} />}
    </>
  );
}
