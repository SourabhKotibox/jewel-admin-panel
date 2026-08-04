import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import { IMG } from "../../data/images";
import ProductCard from "../product/ProductCard";
import SectionHeading from "../ui/SectionHeading";

export default function CelebPicks() {
  return (
    <section className="container-luxe py-16 md:py-20">
      <SectionHeading
        eyebrow="As Seen On"
        title="Celeb Picks"
        action={<Link to="/shop" className="link-underline text-sm">View all</Link>}
      />

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="mt-10 !overflow-visible celeb-swiper"
      >
        {products.map((p, i) => (
          <SwiperSlide key={p.id}>
            <ProductCard product={p} image={IMG.product[i % IMG.product.length]} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}