import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { api } from "../../api/client";

const shopLinks = [
  { label: "Necklaces", path: "/shop?category=Necklaces" },
  { label: "Earrings", path: "/shop?category=Earrings" },
  { label: "Rings", path: "/shop?category=Rings" },
  { label: "Bracelets", path: "/shop?category=Bracelets" },
  { label: "Maang Tikkas", path: "/shop?category=Accessories" },
];
const exploreLinks = [
  { label: "Lumina by Madhu", path: "/shop" },
  { label: "Aurora by Madhu", path: "/shop" },
  { label: "Noor by Madhu", path: "/shop" },
  { label: "Bestsellers", path: "/shop" },
  { label: "Gifting", path: "/shop" },
];
const moreLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
  { label: "Track Order", path: "/track-order" },
  { label: "Stores", path: "/stores" },
  { label: "FAQs", path: "/faq" },
  { label: "Blog", path: "/blog" },
  { label: "Terms & Conditions", path: "/pages/terms-conditions" },
  { label: "Privacy Policy", path: "/pages/privacy-policy" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState("");
  const [joinErr, setJoinErr] = useState("");

  const onJoin = async (e) => {
    e.preventDefault();
    setJoinMsg("");
    setJoinErr("");
    setJoining(true);
    try {
      const res = await api("/newsletter/subscribe", {
        method: "POST",
        body: { email: email.trim() },
        portal: "user",
      });
      setJoinMsg(res.message || "Thank you for joining!");
      setEmail("");
    } catch (err) {
      setJoinErr(err.message || "Could not subscribe");
    } finally {
      setJoining(false);
    }
  };

  return (
    <footer className="bg-noir text-ivory/80">
      <div className="container-luxe py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div>
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">More</h4>
          <ul className="space-y-2.5 text-sm">
            {moreLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <h4 className="text-champagne-light text-sm uppercase tracking-widest2 mb-4">
            Exclusive Benefits
          </h4>
          <p className="text-sm mb-4 text-ivory/60">
            Apply for free membership to receive exclusive deals, news, and events.
          </p>
          <form className="flex border-b border-champagne/40 pb-2 mb-2" onSubmit={onJoin}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email here"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-ivory/40"
              disabled={joining}
            />
            <button
              type="submit"
              disabled={joining}
              className="text-champagne text-sm uppercase tracking-wide disabled:opacity-50"
            >
              {joining ? "…" : "Join"}
            </button>
          </form>
          {joinMsg ? <p className="text-xs text-champagne mb-4">{joinMsg}</p> : null}
          {joinErr ? <p className="text-xs text-rose-400 mb-4">{joinErr}</p> : null}
          {!joinMsg && !joinErr ? <div className="mb-4" /> : null}
          <div className="flex gap-4">
            <a href="https://www.facebook.com/MadhuJewellery" aria-label="Facebook">
              <Facebook size={20} className="hover:text-champagne" />
            </a>
            <a href="https://www.instagram.com/madhujewellery" aria-label="Instagram">
              <Instagram size={20} className="hover:text-champagne" />
            </a>
            <a href="https://www.youtube.com/@madhubykaranjohar" aria-label="YouTube">
              <Youtube size={20} className="hover:text-champagne" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-champagne/10 py-5">
        <p className="text-center text-xs text-ivory/40 tracking-wide">
          © {new Date().getFullYear()} Madhu Jewellery Private Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
