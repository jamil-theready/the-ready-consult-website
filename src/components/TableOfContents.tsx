interface RelatedPost {
  slug: string;
  title: string;
  category?: string;
  image?: string;
  imageAlt?: string;
}

interface Props {
  headings: { text: string; id: string }[];
  relatedPost?: RelatedPost | null;
}

export default function TableOfContents({ headings, relatedPost }: Props) {
  if (headings.length < 2 && !relatedPost) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-28 space-y-6">
        {headings.length >= 2 && (
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-400 mb-3">
              Jump to Section
            </p>
            <ol className="space-y-2">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="text-sm text-gray-500 hover:text-teal leading-snug block transition-colors"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {relatedPost && (
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-400 mb-3">
              Read Next
            </p>
            <a
              href={`/blog/${relatedPost.slug}`}
              className="group block"
            >
              {relatedPost.image && (
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.imageAlt || relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {relatedPost.category && (
                <p className="text-teal text-[10px] font-semibold tracking-[0.16em] uppercase mb-1">
                  {relatedPost.category}
                </p>
              )}
              <h4 className="text-sm font-semibold text-navy leading-snug group-hover:text-teal transition-colors line-clamp-3">
                {relatedPost.title}
              </h4>
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
