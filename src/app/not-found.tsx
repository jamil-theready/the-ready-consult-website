import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-navy text-2xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-medium text-navy mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex cta-btn text-foreground font-medium px-8 py-3.5 transition-all hover:scale-[1.03]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
