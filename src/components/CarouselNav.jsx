import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * High-contrast carousel controls — light (ivory cards) or dark (store section).
 */
export default function CarouselNav({
  onPrev,
  onNext,
  tone = "light",
  className = "",
}) {
  const base =
    tone === "dark"
      ? "bg-ivory text-noir border-ivory shadow-md hover:bg-champagne hover:border-champagne"
      : "bg-noir text-champagne-light border-noir shadow-md hover:bg-champagne-dark hover:text-ivory hover:border-champagne-dark";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-colors ${base}`}
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-colors ${base}`}
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>
    </div>
  );
}

export const carouselAutoplay = {
  delay: 3500,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
};
