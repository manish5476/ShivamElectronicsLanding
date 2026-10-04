import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="heading-serif text-8xl font-light text-champagne mb-4">404</p>
        <h1 className="heading-serif text-3xl font-semibold text-espresso mb-4">
          Page Not Found
        </h1>
        <p className="text-taupe mb-8 max-w-md mx-auto">
          Looks like this design has wandered away. Let's guide you back to our beautiful collections.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-espresso text-ivory px-6 py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors"
          >
            Return Home
          </Link>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 border border-espresso text-espresso px-6 py-3 text-sm font-sans font-medium hover:bg-espresso hover:text-ivory transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
