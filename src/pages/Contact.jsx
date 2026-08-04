import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import useCmsPage from "../hooks/useCmsPage";
import CmsCustomBlock from "../components/CmsCustomBlock";
import SeoHead from "../components/SeoHead";
import { api, assetUrl } from "../api/client";
import useSettingsStore from "../store/useSettingsStore";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

function digitsOnly(v) {
  return String(v || "").replace(/\D/g, "");
}

export default function Contact() {
  const { fields: c, renderables } = useCmsPage("contact");
  const business = useSettingsStore((s) => s.business) || {};
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sentHint, setSentHint] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  const waNumber =
    digitsOnly(c.whatsappNumber) || digitsOnly(business.whatsapp) || "919619587978";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSentHint("");
    setSending(true);
    try {
      const res = await api("/contact", {
        method: "POST",
        body: form,
        portal: "user",
      });
      setSentHint(res.message || c.successMessage || "Message sent — we’ll reply soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (ex) {
      setErr(ex.message || "Could not send. Try WhatsApp instead.");
    } finally {
      setSending(false);
    }
  };

  const openWhatsApp = () => {
    let msg = `Hello Madhu Jewellery!\n\n`;
    msg += `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n`;
    msg += `Message:\n${form.message}`;
    window.open(
      `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const Hero = (
    <div className="relative w-full h-[40vh] md:h-[48vh] flex items-center justify-center overflow-hidden bg-noir">
      <div className="absolute inset-0">
        {c.heroImage ? (
          <img
            src={resolveImg(c.heroImage)}
            alt=""
            className="w-full h-full object-cover opacity-50 object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/45 to-transparent" />
        <div className="grain-overlay" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <p className="text-[10px] md:text-xs uppercase tracking-widest2 text-champagne mb-2 font-semibold">
          {c.heroEyebrow}
        </p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-ivory leading-tight">
          {c.heroTitle}
        </h1>
        <p className="text-ivory/70 text-xs md:text-sm mt-4 leading-relaxed max-w-xl mx-auto">
          {c.heroSubtitle}
        </p>
      </div>
    </div>
  );

  const infoCards = [
    {
      icon: Phone,
      label: c.phoneLabel,
      value: c.phoneValue,
      href: c.phoneValue ? `tel:${digitsOnly(c.phoneValue)}` : undefined,
    },
    {
      icon: Mail,
      label: c.emailLabel,
      value: c.emailValue,
      href: c.emailValue ? `mailto:${c.emailValue}` : undefined,
    },
    {
      icon: MapPin,
      label: c.addressLabel,
      value: c.addressValue,
    },
    {
      icon: Clock,
      label: c.hoursLabel,
      value: c.hoursValue,
    },
    {
      icon: MessageCircle,
      label: c.whatsappLabel,
      value: c.phoneValue || "Chat with us",
      href: `https://api.whatsapp.com/send?phone=${waNumber}`,
      external: true,
    },
  ];

  const Info = (
    <section className="container-luxe py-14 md:py-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {infoCards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <>
              <Icon size={22} className="text-champagne-dark mb-4" strokeWidth={1.5} />
              <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1.5">
                {card.label}
              </p>
              <p className="text-sm md:text-base text-noir leading-relaxed">{card.value}</p>
            </>
          );
          const className =
            "block border border-champagne/15 bg-white/60 p-6 md:p-7 hover:border-champagne/40 transition-colors";
          if (card.href) {
            return (
              <a
                key={card.label}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className={className}
              >
                {inner}
              </a>
            );
          }
          return (
            <div key={card.label} className={className}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );

  const Form = (
    <section className="bg-stone-50/80 border-y border-champagne/10">
      <div className="container-luxe py-14 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-display text-3xl md:text-4xl text-noir mb-3">{c.formTitle}</h2>
          <p className="text-sm text-noir/55 mb-8 leading-relaxed">{c.formSubtitle}</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
                {c.nameLabel}
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className="w-full border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
                  {c.emailFieldLabel}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  className="w-full border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
                  {c.phoneFieldLabel}
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
                {c.messageLabel}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={onChange}
                placeholder={c.messagePlaceholder}
                className="w-full border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne resize-y"
              />
            </div>
            {sentHint && <p className="text-sm text-champagne-dark">{sentHint}</p>}
            {err && <p className="text-sm text-rose-600">{err}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={sending}
                className="btn-gold w-full sm:w-auto px-10 py-4 inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Mail size={18} />
                {sending ? "Sending…" : c.submitCta || "Send message"}
              </button>
              <button
                type="button"
                onClick={openWhatsApp}
                className="btn-outline w-full sm:w-auto px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

  const Visit = (
    <section className="container-luxe py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="aspect-[4/5] overflow-hidden bg-stone-100 rounded-sm">
          {c.visitImage ? (
            <img
              src={resolveImg(c.visitImage)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div>
          {c.visitEyebrow && <p className="eyebrow mb-3">{c.visitEyebrow}</p>}
          <h2 className="heading-display text-3xl md:text-4xl text-noir leading-tight mb-5">
            {c.visitTitle}
          </h2>
          <p className="text-noir/70 text-sm md:text-base leading-relaxed mb-8">
            {c.visitBody}
          </p>
          {c.visitCta && (
            <Link to={c.visitCtaLink || "/stores"} className="btn-outline">
              {c.visitCta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );

  const builtins = { hero: Hero, info: Info, form: Form, visit: Visit };

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead
        title="Contact Us"
        description="Reach Madhu Jewellery for bridal consultations, store visits, custom orders, and WhatsApp support."
        keywords="contact Madhu jewellery, bridal consultation, WhatsApp jewellery, store visit"
      />
      {renderables.map((item) => {
        if (item.type === "custom") {
          return <CmsCustomBlock key={item.id} data={item.data} />;
        }
        return <div key={item.id}>{builtins[item.id] || null}</div>;
      })}
    </div>
  );
}
