import { useEffect } from "react";
import HomeSections from "../components/HomeSections";
import SeoHead from "../components/SeoHead";
import useStorefrontStore from "../store/useStorefrontStore";

export default function Home() {
  const fetchHome = useStorefrontStore((s) => s.fetchHome);
  const loading = useStorefrontStore((s) => s.loading);
  const loaded = useStorefrontStore((s) => s.loaded);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  if (!loaded && loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory">
        <SeoHead title="Home" />
        <div className="text-center">
          <p className="eyebrow mb-3">Madhu Jewellery</p>
          <p className="text-sm text-noir/50 uppercase tracking-widest2">Loading collection…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title="Home"
        description="Handcrafted Polki, Jadau and diamond jewellery by Madhu. Bridal sets, festive pieces, and everyday luxury — certified and hallmarked."
        keywords="Madhu jewellery, Polki jewellery, Jadau, bridal jewellery, diamond jewellery India"
      />
      <HomeSections />
    </>
  );
}
