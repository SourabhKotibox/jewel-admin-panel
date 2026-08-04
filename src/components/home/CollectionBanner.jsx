import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMG } from "../../data/images";

const banners = [
  {
    title: "Natural Uncut Diamonds",
    desc: "Handcrafted in hallmarked 18KT gold with natural gemstones, cut and uncut diamonds.",
    img: IMG.uncutDiamond,
    link: "/shop?diamond=1",
  },
  {
    title: "Bridal Jewellery",
    desc: "Timeless handcrafted statements for celebrations that live forever in 18KT and 22KT gold.",
    img: IMG.bridalBanner,
    link: "/shop?bridal=1",
  },
];

export default function CollectionBanner() {
  return (
    <section className="container-luxe py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-6">
        {banners.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative group overflow-hidden rounded-sm aspect-[4/5] md:aspect-[16/11]"
          >
            <img
              src={b.img}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
              <h3 className="heading-display text-2xl md:text-3xl text-ivory mb-2">{b.title}</h3>
              <p className="text-ivory/70 text-sm max-w-sm mb-5 leading-relaxed">{b.desc}</p>
              <Link
                to={b.link}
                className="flex items-center gap-2 text-champagne-light text-xs uppercase tracking-widest2 border-b border-champagne/50 pb-1"
              >
                Explore Now <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}