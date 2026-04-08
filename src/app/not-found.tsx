export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-teal text-2xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex bg-teal text-white font-medium px-8 py-3.5 rounded-full hover:bg-teal-light transition-colors shadow-lg shadow-teal/25"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
