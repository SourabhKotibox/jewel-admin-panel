import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

/** Render HTML from editor, or plain text with line breaks. */
function ArticleBody({ body }) {
  const raw = String(body || "");
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  if (looksHtml) {
    return <div className="blog-prose" dangerouslySetInnerHTML={{ __html: raw }} />;
  }
  return (
    <div className="blog-prose whitespace-pre-wrap">
      {raw.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let row = null;
        try {
          row = await api(`/blog/${encodeURIComponent(slug)}`);
        } catch {
          const list = await api("/blog");
          row = (Array.isArray(list) ? list : []).find((p) => p.slug === slug);
        }
        if (!cancelled) {
          if (!row || (row.status && row.status !== "Published")) {
            setError("Post not found");
            setPost(null);
          } else {
            setPost(row);
            setError("");
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-luxe py-20 text-sm text-noir/45">Loading…</div>
    );
  }

  if (error || !post) {
    return (
      <div className="container-luxe py-20 text-center">
        <SeoHead title="Post not found" noIndex />
        <p className="font-display text-2xl text-noir mb-4">{error || "Not found"}</p>
        <Link to="/blog" className="text-champagne-dark underline text-sm">
          Back to journal
        </Link>
      </div>
    );
  }

  const metaTitle = post.metaTitle || post.title;
  const metaDescription =
    post.metaDescription || post.excerpt || excerptHtml(post.body, 155);
  const metaKeywords =
    post.metaKeywords ||
    `${post.title}, Madhu jewellery, Polki, Jadau, bridal jewellery blog`;
  const cover = post.cover ? coverSrc(post.cover) : "";

  return (
    <article className="bg-ivory min-h-screen pb-20">
      <SeoHead
        title={metaTitle}
        description={metaDescription}
        keywords={metaKeywords}
        image={cover || undefined}
        type="article"
      />

      {cover ? (
        <div className="w-full max-h-[52vh] overflow-hidden bg-stone-100">
          <img
            src={cover}
            alt=""
            className="w-full max-h-[52vh] object-cover object-center"
          />
        </div>
      ) : (
        <div className="h-24 md:h-32 bg-gradient-to-b from-white to-ivory border-b border-champagne/10" />
      )}

      <div className="container-luxe">
        <div className="max-w-3xl mx-auto -mt-6 md:-mt-10 relative z-10">
          <div className="bg-white border border-champagne/15 px-6 py-8 md:px-12 md:py-12 shadow-sm">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-noir/45 hover:text-champagne-dark mb-6"
            >
              <ArrowLeft size={14} /> Journal
            </Link>
            <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-3">
              {formatDate(post.date)}
            </p>
            <h1 className="heading-display text-3xl md:text-5xl text-noir mb-6 leading-tight">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-base md:text-lg text-noir/55 leading-relaxed mb-8 border-l-2 border-champagne pl-4">
                {post.excerpt}
              </p>
            ) : null}
            <ArticleBody body={post.body} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link
              to="/blog"
              className="text-champagne-dark uppercase tracking-widest2 text-[11px] hover:underline"
            >
              ← All journal posts
            </Link>
            <Link
              to="/faq"
              className="text-noir/50 uppercase tracking-widest2 text-[11px] hover:text-champagne-dark"
            >
              Questions? Visit FAQs
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
