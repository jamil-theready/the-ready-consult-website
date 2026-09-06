"use client";

import { useState } from "react";

interface Props {
  url: string;
  title: string;
}

export default function ShareSidebar({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2H21l-6.523 7.453L22 22h-6.84l-4.78-6.244L4.8 22H2l7-7.99L1.5 2h6.96l4.32 5.71L18.244 2Zm-1.2 18h1.882L7.05 4H5.05l11.994 16Z" />
        </svg>
      ),
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.99V22h-4.56v-6.21c0-1.48-.03-3.39-2.06-3.39-2.07 0-2.39 1.62-2.39 3.29V22H7.62V8z" />
        </svg>
      ),
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="hidden lg:block fixed inset-x-0 top-28 z-30 pointer-events-none">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="-ml-16 w-12 flex flex-col items-center gap-3 pointer-events-auto">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.label}
              className="w-10 h-10 rounded-full border border-gray-200 bg-slab text-gray-500 hover:text-teal hover:border-teal flex items-center justify-center transition-colors"
            >
              {l.icon}
            </a>
          ))}
          <button
            onClick={copy}
            aria-label="Copy link"
            className="w-10 h-10 rounded-full border border-gray-200 bg-slab text-gray-500 hover:text-teal hover:border-teal flex items-center justify-center transition-colors"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M10 4.5a3.5 3.5 0 0 0-3.5 3.5v2H8V8a2 2 0 1 1 4 0v2h1.5V8A3.5 3.5 0 0 0 10 4.5zM6.5 12v2A3.5 3.5 0 0 0 10 17.5a3.5 3.5 0 0 0 3.5-3.5v-2H12v2a2 2 0 1 1-4 0v-2H6.5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
