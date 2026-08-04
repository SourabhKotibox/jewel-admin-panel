import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, assetUrl } from "../api/client";
import SeoHead from "../components/SeoHead";
import { excerptHtml } from "../utils/htmlText";

function coverSrc(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  return assetUrl(src);
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/blog")
      .then((list) => {
        const published = (Array.isArray(list) ? list : []).filter(
          (p) => p.status === "Published" || !p.status
        );
        setPosts(published);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead
        title="Blog"
        description="Stories from the Madhu atelier — Jadau craft, bridal trunk shows, Polki care, and jewellery heritage."
        keywords="Madhu jewellery blog, Jadau, Polki care, bridal jewellery tips, Indian jewellery journal"
      />

      <header className="border-b border-champagne/15 bg-gradient-to-b from-white to-ivory">
        <div className="container-luxe py-12 md:py-16">
          <p className="eyebrow mb-2">Journal</p>
          <h1 className="heading-display text-4xl md:text-5xl text-noir mb-3">From the atelier</h1>
          <p className="text-sm md:text-base text-noir/55 max-w-xl">
            Craft notes, bridal diaries, and care guides — written by our workshop team.
          </p>
        </div>
      </header>

      <div className="container-luxe py-10 md:py-14">
        {loading ? (
          <p className="text-sm text-noir/45">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-noir/45">No posts published yet. Check back soon.</p>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {featured ? (
              <Link
                to={`/blog/${featured.slug}`}
                className="group grid md:grid-cols-2 gap-0 md:gap-10 border border-champagne/15 bg-white overflow-hidden hover:border-champagne/40 transition-colors"
              >
                <div className="aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-stone-100 overflow-hidden">
                  {featured.cover ? (
                    <img
                      src={coverSrc(featured.cover)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[240px] bg-gradient-to-br from-noir/5 to-champagne/15" />
                  )}
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-2">
                    Featured · {formatDate(featured.date)}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-noir group-hover:text-champagne-dark transition-colors mb-3">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-noir/55 leading-relaxed mb-6 max-w-md">
                    {featured.excerpt || excerptHtml(featured.body, 180)}
                  </p>
                  <span className="text-[11px] uppercase tracking-widest2 text-champagne-dark">
                    Read article →
                  </span>
                </div>
              </Link>
            ) : null}

            {rest.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {rest.map((p) => (
                  <Link
                    key={p.id || p._id || p.slug}
                    to={`/blog/${p.slug}`}
                    className="group border border-champagne/15 bg-white overflow-hidden hover:border-champagne/40 transition-colors flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                      {p.cover ? (
                        <img
                          src={coverSrc(p.cover)}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-noir/5 to-champagne/10" />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">
                        {formatDate(p.date)}
                      </p>
                      <h2 className="font-display text-xl text-noir group-hover:text-champagne-dark transition-colors">
                        {p.title}
                      </h2>
                      <p className="text-sm text-noir/50 mt-2 line-clamp-3 flex-1">
                        {p.excerpt || excerptHtml(p.body, 140)}
                      </p>
                      <span className="mt-4 text-[10px] uppercase tracking-widest2 text-champagne-dark">
                        Read more
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
