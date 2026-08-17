import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Instagram,
  ShieldCheck,
  RefreshCcw,
  Truck,
  Store,
  Globe,
  Award,
  Quote,
  Star,
  Phone,
  MapPin,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ProductCard from "./product/ProductCard";
import CarouselNav, { carouselAutoplay } from "./CarouselNav";
import useStorefrontStore from "../store/useStorefrontStore";
import { shopPath, toShopHref } from "../utils/shopLinks";
import { assetUrl } from "../api/client";

function SectionHeading({ eyebrow, title, action, center = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${
        center ? "items-center text-center" : "items-start"
      }`}
    >
      <div className={center ? "text-center w-full md:w-auto md:flex-1" : "text-left"}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-noir leading-tight">
          {title}
        </h2>
      </div>
      {action && (
        <div className={`mt-2 md:mt-0 shrink-0 ${center ? "mx-auto md:mx-0" : ""}`}>{action}</div>
      )}
    </div>
  );
}

function Hero() {
  const c = useStorefrontStore((s) => s.cms);
  return (
    <section className="relative w-full bg-noir overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[85vh] lg:min-h-[90vh]">
        <div className="relative flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-20 lg:py-24 order-2 lg:order-1">
          <div className="grain-overlay" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-5 text-champagne-light"
          >
            {c.heroEyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] text-ivory leading-[1.1] max-w-xl"
          >
            {c.heroTitle}
            <br />
            <span className="text-champagne-light italic">{c.heroTitleAccent}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-ivory/60 mt-6 max-w-md text-sm md:text-[15px] leading-relaxed"
          >
            {c.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 mt-10"
          >
            <Link to={toShopHref(c.heroCtaPrimaryLink || "/shop?bridal=1")} className="btn-gold">
              {c.heroCtaPrimary}
            </Link>
            <Link
              to={toShopHref(c.heroCtaSecondaryLink || "/shop")}
              className="group flex items-center gap-2 text-ivory text-xs md:text-sm uppercase tracking-widest2"
            >
              {c.heroCtaSecondary}
              <ArrowRight
                size={15}
                className="text-champagne group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex gap-8 md:gap-12 mt-16 pt-8 border-t border-champagne/15"
          >
            {(c.heroStats || []).map(([num, label]) => (
              <div key={label}>
                <p className="heading-display text-2xl md:text-3xl text-champagne-light">{num}</p>
                <p className="text-[10px] uppercase tracking-wide text-ivory/40 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="relative order-1 lg:order-2 h-[45vh] sm:h-[55vh] lg:h-full overflow-hidden">
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={c.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent lg:bg-gradient-to-l lg:from-noir/30 lg:via-transparent lg:to-transparent" />
        </div>
      </div>
    </section>
  );
}

function MarqueeBanner() {
  const statements = useStorefrontStore((s) => s.cms.marquee) || [];
  if (!statements.length) return null;
  return (
    <div className="bg-noir text-champagne border-y border-champagne/20 py-4 md:py-5 overflow-hidden select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, outerIdx) => (
          <div key={outerIdx} className="flex gap-16 items-center mx-4">
            {statements.map((s, i) => (
              <span
                key={i}
                className="text-[10px] md:text-xs uppercase tracking-widest2 font-semibold flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" /> {s}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryStrip() {
  const c = useStorefrontStore((s) => s.cms);
  const categories = useStorefrontStore((s) => s.categories);
  if (!categories.length) return null;
  return (
    <section className="container-luxe py-16 md:py-24">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <p className="eyebrow mb-2">{c.categoryEyebrow}</p>
          <h2 className="heading-display text-3xl md:text-4xl text-noir">{c.categoryTitle}</h2>
        </div>
      </div>

      <div className="-mx-4 sm:-mx-6">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 pb-4 scrollbar-none">
          {categories.map((category, i) => (
            <motion.div
              key={category.slug || category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex-shrink-0 w-[220px] sm:w-[260px] snap-start"
            >
              <Link
                to={shopPath(category.slug)}
                className="group block relative overflow-hidden rounded-sm aspect-[3/4]"
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <span className="absolute bottom-5 left-0 right-0 text-center text-ivory text-xs md:text-sm uppercase tracking-widest2 font-semibold">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionBanner() {
  const c = useStorefrontStore((s) => s.cms);
  const banners = c.collectionBanners || [];
  if (!banners.length) return null;
  return (
    <section className="container-luxe pb-16 md:pb-24">
      <div className="grid md:grid-cols-3 gap-5 md:gap-6">
        {banners.map((banner, i) => (
          <motion.div
            key={`${banner.title}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <Link
              to={toShopHref(banner.link || "/shop")}
              className="group relative block overflow-hidden rounded-sm aspect-[3/4]"
            >
              <img
                src={banner.img}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/95 via-noir/25 to-noir/10" />
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <span className="text-champagne-light/70 font-display italic text-lg">{banner.index}</span>
                <span className="bg-ivory/90 text-noir text-[10px] uppercase tracking-widest2 px-3 py-1.5 rounded-full">
                  {banner.tag}
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-7">
                <h3 className="heading-display text-xl md:text-2xl text-ivory leading-tight mb-2">
                  {banner.title}
                </h3>
                <p className="text-ivory/65 text-xs md:text-[13px] leading-relaxed mb-4 max-w-[85%]">
                  {banner.desc}
                </p>
                <span className="flex items-center gap-2 text-champagne-light text-[11px] uppercase tracking-widest2 border-b border-champagne/40 pb-1 group-hover:border-champagne group-hover:gap-3 transition-all duration-300">
                  {c.bannerExploreCta} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BrandCampaign() {
  const c = useStorefrontStore((s) => s.cms);
  const categories = useStorefrontStore((s) => s.categories).slice(0, 3);
  if (!categories.length) return null;
  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="container-luxe">
        <div className="text-center mb-12 md:mb-16">
          <p className="eyebrow mb-3">{c.editEyebrow}</p>
          <h2 className="heading-display text-3xl md:text-5xl text-noir">
            {c.editTitle}{" "}
            <span className="italic text-champagne-dark">{c.editTitleAccent}</span>
          </h2>
          <p className="text-noir/50 text-sm max-w-md mx-auto mt-4 leading-relaxed">
            {c.editSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-7">
          {categories.map((item) => (
            <Link key={item.slug} to={shopPath(item.slug)} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-sm">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-center text-base text-noir mt-4 group-hover:text-champagne-dark transition-colors">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function JadauHeritage() {
  const c = useStorefrontStore((s) => s.cms);
  return (
    <section className="bg-stone-50 border-y border-champagne/15 py-20 md:py-28 overflow-hidden">
      <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div className="absolute -inset-4 border border-champagne/20 scale-95 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[3/4] overflow-hidden rounded-sm relative group"
          >
            <img
              src={c.brandStoryImage}
              alt=""
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-noir/20" />
          </motion.div>
        </div>
        <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
          <p className="eyebrow mb-3">{c.brandStoryEyebrow}</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-noir leading-[1.1] mb-6">
            {c.brandStoryTitle}{" "}
            <span className="italic text-champagne-dark">{c.brandStoryTitleAccent}</span>
          </h2>
          <p className="text-noir/70 text-sm md:text-base leading-relaxed mb-6">{c.brandStoryBody1}</p>
          <p className="text-noir/70 text-sm md:text-base leading-relaxed mb-8">{c.brandStoryBody2}</p>
          <div>
            <Link to={c.brandStoryCtaLink || "/about"} className="btn-outline">
              {c.brandStoryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HandcraftedTabs() {
  const [active, setActive] = useState(null);
  const c = useStorefrontStore((s) => s.cms);
  const products = useStorefrontStore((s) => s.products);

  const tabs = (c.handcraftedTabs || [])
    .filter((t) => t && t.enabled !== false && t.label)
    .map((tab) => {
      const links = (tab.productSkus || [])
        .map((sku) => {
          const p = products.find(
            (x) => x.sku === sku || x.id === sku || String(x._id) === sku
          );
          if (!p) return null;
          return { name: p.name, slug: p.slug, sku };
        })
        .filter(Boolean);
      return {
        key: tab.id || tab.label,
        label: tab.label,
        img: tab.image,
        links,
      };
    })
    .filter((t) => t.links.length > 0 || t.img);

  if (!tabs.length) return null;

  const currentKey = active || tabs[0]?.key;
  const current = tabs.find((t) => t.key === currentKey) || tabs[0];

  return (
    <section className="container-luxe py-20 md:py-28">
      <SectionHeading eyebrow={c.handcraftedEyebrow} title={c.handcraftedTitle} center />
      <div className="flex justify-center flex-wrap gap-6 md:gap-12 mt-10 border-b border-champagne/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`relative pb-4 text-xs md:text-sm uppercase tracking-widest2 font-semibold transition-colors ${
              currentKey === tab.key ? "text-noir" : "text-noir/40"
            }`}
          >
            {tab.label}
            {currentKey === tab.key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne"
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-16 mt-12 items-center"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-sm relative group bg-stone-100">
            {current?.img ? (
              <img
                src={current.img}
                alt={current.label}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {(current?.links || []).length === 0 ? (
              <p className="text-sm text-noir/45">No products assigned to this tab yet.</p>
            ) : (
              current.links.map((link) => (
                <Link
                  key={link.sku || link.slug}
                  to={`/products/${link.slug}`}
                  className="flex items-center justify-between border-b border-champagne/15 pb-4 group"
                >
                  <span className="heading-display text-lg md:text-xl text-noir group-hover:text-champagne-dark transition-colors">
                    {link.name}
                  </span>
                  <span className="text-champagne-dark text-sm group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function CelebPicks() {
  const swiperRef = useRef(null);
  const c = useStorefrontStore((s) => s.cms);
  const products = useStorefrontStore((s) => s.products);
  const celebProducts = products.filter((p) => p.celeb).slice(0, 12);
  const list = celebProducts.length ? celebProducts : products.slice(0, 8);
  if (!list.length) return null;
  return (
    <section className="container-luxe pb-20 md:pb-28">
      <SectionHeading
        eyebrow={c.celebEyebrow}
        title={c.celebTitle}
        action={
          <div className="flex items-center gap-4">
            <CarouselNav
              onPrev={() => swiperRef.current?.slidePrev()}
              onNext={() => swiperRef.current?.slideNext()}
              tone="light"
            />
            <Link
              to={c.celebViewAllLink || "/shop"}
              className="link-underline text-xs md:text-sm uppercase tracking-wider font-semibold hidden sm:inline"
            >
              {c.celebViewAll}
            </Link>
          </div>
        }
      />
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={carouselAutoplay}
        loop={list.length > 4}
        spaceBetween={16}
        slidesPerView={1.35}
        watchOverflow
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="mt-10 celeb-swiper"
      >
        {list.map((product) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <ProductCard product={product} image={product.images?.[0]} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex sm:hidden justify-center mt-6">
        <Link
          to={c.celebViewAllLink || "/shop"}
          className="link-underline text-xs uppercase tracking-wider font-semibold"
        >
          {c.celebViewAll}
        </Link>
      </div>
    </section>
  );
}

function EditorialCanvas() {
  const c = useStorefrontStore((s) => s.cms);
  return (
    <section className="relative w-full h-[75vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-noir">
        <motion.img
          initial={{ scale: 1.08, opacity: 0.55 }}
          whileInView={{ scale: 1, opacity: 0.65 }}
          viewport={{ once: false }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={c.editorialImage}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/30 via-noir/50 to-noir/80" />
        <div className="grain-overlay" />
      </div>
      <div className="relative text-center px-4 max-w-4xl z-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow text-champagne-light mb-4"
        >
          {c.editorialEyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="heading-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory leading-[1.1] mb-6"
        >
          {c.editorialTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-ivory/60 text-xs md:text-sm max-w-lg mx-auto mb-8 leading-relaxed"
        >
          {c.editorialBody}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
        >
          <Link to={toShopHref(c.editorialCtaLink || "/shop")} className="btn-gold">
            {c.editorialCta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = useStorefrontStore((s) => s.cms.trustBadges) || [];
  const icons = [ShieldCheck, RefreshCcw, Truck, Store, Globe, Award];
  if (!badges.length) return null;
  return (
    <section className="bg-stone-50 border-y border-champagne/15">
      <div className="container-luxe py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {badges.map((badge, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={badge.title} className="flex flex-col items-center text-center gap-2">
              <Icon size={26} className="text-champagne-dark" strokeWidth={1.5} />
              <p className="text-xs md:text-sm font-medium text-noir uppercase tracking-wider">
                {badge.title}
              </p>
              <p className="text-[11px] text-noir/50">{badge.subtitle}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StoreLocator() {
  const swiperRef = useRef(null);
  const c = useStorefrontStore((s) => s.cms);
  const stores = useStorefrontStore((s) => s.stores);
  const whatsapp = useStorefrontStore((s) => s.whatsapp);
  const waBookHref = (city) => {
    const msg = (c.storesWaMessage || "Hi, I'd like to book an appointment at your {city} store.").replace(
      "{city}",
      city
    );
    return `https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURIComponent(msg)}`;
  };
  if (!stores.length) return null;

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={c.brandStoryImage}
          alt=""
          className="w-full h-full object-cover object-center scale-110 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-champagne-dark/70 via-noir/60 to-noir/90" />
      </div>
      <div className="grain-overlay" />
      <div className="container-luxe relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <div>
            <p className="eyebrow text-champagne-light mb-2">{c.storesEyebrow}</p>
            <h2 className="heading-display text-3xl md:text-5xl text-ivory leading-tight">
              {c.storesTitle}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <CarouselNav
              tone="dark"
              onPrev={() => swiperRef.current?.slidePrev()}
              onNext={() => swiperRef.current?.slideNext()}
            />
            <Link
              to="/stores"
              className="inline-flex items-center justify-center bg-ivory text-noir text-xs uppercase tracking-widest2 px-6 py-2.5 rounded-full hover:bg-champagne transition-colors font-semibold"
            >
              {c.storesViewAll}
            </Link>
          </div>
        </div>
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          autoplay={carouselAutoplay}
          loop={stores.length > 3}
          spaceBetween={16}
          slidesPerView={1.15}
          watchOverflow
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="stores-swiper"
        >
          {stores.map((store) => (
            <SwiperSlide key={store.id || store.city} className="!h-auto">
              <div className="bg-ivory rounded-2xl overflow-hidden shadow-xl border border-ivory/40 flex flex-col h-full">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={store.img}
                    alt={store.city}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-display text-lg text-noir font-semibold">
                    {store.city}, {store.state}
                  </h4>
                  <p className="text-[11px] text-noir/60 mt-2 flex items-start gap-1.5">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0 text-champagne-dark" />{" "}
                    {store.address}
                  </p>
                  <p className="text-[11px] text-noir/45 mt-1.5">{store.hours}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="text-champagne-dark font-semibold">{store.phone}</span>
                    {store.mapUrl ? (
                      <>
                        <span className="text-noir/30">·</span>
                        <a
                          href={store.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline text-noir/70"
                        >
                          {c.storesMapLabel}
                        </a>
                      </>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 mt-auto pt-5">
                    <a
                      href={waBookHref(store.city)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-noir text-ivory text-[11px] uppercase tracking-widest2 text-center py-3 rounded-full hover:bg-champagne-dark transition-colors"
                    >
                      {c.storesBookCta}
                    </a>
                    <a
                      href={`tel:${store.phone}`}
                      className="w-11 h-11 flex-shrink-0 rounded-full border border-noir/15 flex items-center justify-center hover:border-champagne hover:bg-champagne/10 transition-colors"
                    >
                      <Phone size={16} className="text-noir" />
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function CoutureSuite() {
  const c = useStorefrontStore((s) => s.cms);
  const whatsapp = useStorefrontStore((s) => s.whatsapp);
  const waConsultHref = `https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURIComponent(
    c.coutureWaMessage || ""
  )}`;
  return (
    <section className="bg-maroon overflow-hidden">
      <div className="grid lg:grid-cols-2 items-stretch min-h-[520px]">
        <div className="relative order-2 lg:order-1 min-h-[320px] lg:min-h-full">
          <img src={c.coutureImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon/0 lg:via-maroon/10 to-maroon/60 lg:to-transparent" />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center px-6 sm:px-10 md:px-16 py-16 md:py-20">
          <p className="eyebrow text-champagne-light mb-3">{c.coutureEyebrow}</p>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-ivory leading-tight mb-5">
            {c.coutureTitle}
          </h2>
          <p className="text-ivory/65 text-sm leading-relaxed mb-8 max-w-md">{c.coutureBody}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={waConsultHref} target="_blank" rel="noopener noreferrer" className="btn-gold">
              {c.coutureCtaPrimary}
            </a>
            <Link
              to={c.coutureCtaSecondaryLink || "/stores"}
              className="inline-flex items-center justify-center gap-2 border border-champagne/30 text-champagne-light hover:text-ivory hover:border-champagne px-8 py-3.5 text-xs uppercase tracking-widest2 transition-all duration-300"
            >
              {c.coutureCtaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const swiperRef = useRef(null);
  const c = useStorefrontStore((s) => s.cms);
  const testimonials = useStorefrontStore((s) => s.testimonials);
  if (!testimonials.length) return null;
  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="container-luxe">
        <SectionHeading
          eyebrow={c.testimonialsEyebrow}
          title={c.testimonialsTitle}
          center
          action={
            testimonials.length > 1 ? (
              <CarouselNav
                tone="light"
                onPrev={() => swiperRef.current?.slidePrev()}
                onNext={() => swiperRef.current?.slideNext()}
              />
            ) : null
          }
        />
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          autoplay={carouselAutoplay}
          loop={testimonials.length > 1}
          spaceBetween={0}
          slidesPerView={1}
          className="mt-12 max-w-2xl mx-auto"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id || testimonial.name}>
              <div className="text-center px-4">
                <Quote size={28} className="text-champagne mx-auto mb-6" strokeWidth={1.5} />
                <p className="font-display italic text-xl md:text-2xl text-noir leading-relaxed mb-8">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-champagne/40"
                  />
                  <div className="text-left">
                    <p className="text-noir text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-noir/45 text-xs">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-0.5 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-champagne text-champagne" />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function InstagramFeed() {
  const c = useStorefrontStore((s) => s.cms);
  const business = useStorefrontStore((s) => s.business);
  const images = c.instagramImages || [];
  const ig = business.instagram || "https://www.instagram.com/madhujewellery/";
  if (!images.length) return null;
  return (
    <section className="container-luxe py-20 md:py-28">
      <SectionHeading
        eyebrow={c.instagramEyebrow}
        title={c.instagramTitle}
        action={
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold uppercase tracking-wider link-underline"
          >
            <Instagram size={15} /> {c.instagramFollow}
          </a>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {images.map((src, index) => (
          <motion.a
            key={index}
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="relative group aspect-square overflow-hidden rounded-sm block"
          >
            <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-noir/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram size={22} className="text-ivory" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function CustomContentSection({ data }) {
  if (!data || data.enabled === false) return null;
  const hasImage = Boolean(data.image);
  return (
    <section className="container-luxe py-16 md:py-24">
      <div
        className={`grid gap-8 lg:gap-16 items-center ${
          hasImage ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto text-center"
        }`}
      >
        {hasImage && (
          <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-100">
            <img src={assetUrl(data.image)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className={hasImage ? "" : ""}>
          {data.eyebrow && <p className="eyebrow mb-3">{data.eyebrow}</p>}
          {data.title && (
            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-noir leading-tight mb-5">
              {data.title}
            </h2>
          )}
          {data.body && (
            <p className="text-noir/70 text-sm md:text-base leading-relaxed mb-8">{data.body}</p>
          )}
          {data.cta && (
            <Link to={data.ctaLink || "/"} className="btn-outline">
              {data.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

const SECTION_COMPONENTS = {
  hero: Hero,
  marquee: MarqueeBanner,
  category: CategoryStrip,
  banners: CollectionBanner,
  handcrafted: HandcraftedTabs,
  edit: BrandCampaign,
  legacy: JadauHeritage,
  celeb: CelebPicks,
  editorial: EditorialCanvas,
  trust: TrustBadges,
  stores: StoreLocator,
  couture: CoutureSuite,
  testimonials: TestimonialsSection,
  instagram: InstagramFeed,
};

export default function HomeSections() {
  const cms = useStorefrontStore((s) => s.cms);
  const layout = cms.sectionLayout || {
    hidden: [],
    order: Object.keys(SECTION_COMPONENTS),
    customSections: [],
  };
  const hidden = new Set(layout.hidden || []);
  const customMap = Object.fromEntries(
    (layout.customSections || []).map((c) => [c.id, c])
  );
  const order =
    Array.isArray(layout.order) && layout.order.length
      ? layout.order
      : Object.keys(SECTION_COMPONENTS);

  return (
    <>
      {order.map((id) => {
        if (hidden.has(id)) return null;

        const custom = customMap[id];
        if (custom) {
          if (custom.enabled === false) return null;
          return <CustomContentSection key={id} data={custom} />;
        }

        const Comp = SECTION_COMPONENTS[id];
        if (!Comp) return null;
        return <Comp key={id} />;
      })}
    </>
  );
}
