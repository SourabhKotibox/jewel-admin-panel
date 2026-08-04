import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Quote, Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import useStorefrontStore from "../../store/useStorefrontStore";

/** Legacy home import — uses live testimonials from API */
export default function Testimonials() {
  const testimonials = useStorefrontStore((s) => s.testimonials);
  const loaded = useStorefrontStore((s) => s.loaded);
  const fetchHome = useStorefrontStore((s) => s.fetchHome);

  useEffect(() => {
    if (!loaded) fetchHome();
  }, [loaded, fetchHome]);

  if (!testimonials.length) return null;

  return (
    <section className="relative bg-maroon text-ivory py-16 md:py-20 overflow-hidden">
      <div className="grain-overlay" />
      <div className="container-luxe relative">
        <SectionHeading eyebrow="Voices" title="Madhu Family" center />
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="mt-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id || t.name}>
              <div className="bg-ivory/[0.04] border border-champagne/20 rounded-sm p-7 h-full flex flex-col backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  {t.img ? (
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-champagne/40"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-champagne/20" />
                  )}
                  <div>
                    <p className="text-champagne-light text-sm font-medium">{t.name}</p>
                    <p className="text-ivory/40 text-xs">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={12} className="fill-champagne text-champagne" />
                  ))}
                </div>
                <Quote size={18} className="text-champagne/50 mb-2" />
                <p className="text-sm text-ivory/75 leading-relaxed flex-1">{t.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
