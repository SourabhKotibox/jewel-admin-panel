import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { IMG } from "../../data/images";
import SectionHeading from "../ui/SectionHeading";

export default function InstagramFeed() {
  return (
    <section className="container-luxe py-16 md:py-20">
      <SectionHeading
        eyebrow="@madhujewellery"
        title="Follow Our Brand on Social Media"
        action={
          <a
            href="https://www.instagram.com/madhujewellery/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm link-underline"
          >
            <Instagram size={16} /> Follow
          </a>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10">
        {IMG.insta.map((src, i) => (
          <motion.a
            key={i}
            href="https://www.instagram.com/madhujewellery/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative group aspect-square overflow-hidden rounded-sm"
          >
            <img src={src} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors flex items-center justify-center">
              <Instagram size={22} className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}