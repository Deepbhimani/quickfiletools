import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { blogAPI } from "../services/api";

// ─── AdSense Banner ───────────────────────────────────────────────────────────
function AdBanner({ slot = "1234567890" }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  return (
    <div className="w-full flex justify-center my-8">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true" />
    </div>
  );
}

export default function BlogPost() {
  const { slug }            = useParams();
  const [post, setPost]     = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getOne(slug)
      .then((r) => {
        setPost(r.data);
        // Fetch related posts by first tag
        if (r.data.tags?.length) {
          blogAPI.getAll({ status: "published", tag: r.data.tags[0] })
            .then((res) => setRelated((res.data.posts || []).filter((p) => p.slug !== slug).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      {[1,2,3,4,5].map((i) => <div key={i} className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" style={{ width: `${70 + i * 5}%` }} />)}
    </div>
  );

  if (!post) return (
    <div className="text-center py-20 text-gray-500">
      Post not found. <Link to="/blog" className="text-primary-600 hover:underline">Back to blog</Link>
    </div>
  );

  // Structured data for Google (Article schema)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": { "@type": "Organization", "name": "QuickFileTools" },
    "publisher": { "@type": "Organization", "name": "QuickFileTools", "url": "https://quickfiletools.com" },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://quickfiletools.com/blog/${post.slug}` },
  };

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title} — QuickFileTools Blog</title>
        <meta name="description" content={post.seoDesc || post.excerpt} />
        <meta name="keywords" content={post.tags?.join(", ")} />
        <link rel="canonical" href={`https://quickfiletools.com/blog/${post.slug}`} />
        <meta property="og:title"       content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDesc  || post.excerpt} />
        <meta property="og:type"        content="article" />
        <meta property="og:url"         content={`https://quickfiletools.com/blog/${post.slug}`} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={post.seoTitle || post.title} />
        <meta name="twitter:description" content={post.seoDesc  || post.excerpt} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <article className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag) => (
            <span key={tag} className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full font-medium">{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime} min read</span>
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</span>
          )}
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>By QuickFileTools</span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-72" />
        )}

        {/* Top Ad */}
        <AdBanner slot="1111111111" />

        {/* Content */}
        <div
          className="prose dark:prose-invert prose-sm max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
            prose-img:rounded-xl prose-blockquote:border-primary-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Mid-article Ad */}
        <AdBanner slot="2222222222" />

        {/* Tool CTA */}
        {post.relatedTool && (
          <div className="mt-8 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">Try it yourself — free tool</p>
            <Link to={`/tools/${post.relatedTool}`}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Open Tool <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Bottom Ad */}
        <AdBanner slot="3333333333" />

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Related Articles</h2>
            <div className="space-y-4">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`}
                  className="group flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-primary-300 transition-all">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">{p.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.excerpt}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 shrink-0 mt-1 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}