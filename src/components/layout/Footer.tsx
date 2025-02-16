import Link from "next/link";
export const Footer = () => (
  <footer className="bg-blue-800 text-white p-6 text-center mt-auto">
    <p>© {new Date().getFullYear()} Issue Tracker Pro</p>
    <div className="mt-2 space-x-4">
      <Link href="/about" className="hover:underline">
        About
      </Link>
      <Link href="/contact" className="hover:underline">
        Contact
      </Link>
      <Link href="/privacy" className="hover:underline">
        Privacy Policy
      </Link>
    </div>
  </footer>
);
