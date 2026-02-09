import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-sm text-gray-600 shadow">

        <div>
          <h3 className="text-primary font-semibold mb-2">Milvita</h3>
          <p>Healthy, organic millet products for a better lifestyle.</p>
        </div>

<div>
  <h4 className="font-semibold mb-3 text-gray-800">
    Quick Links
  </h4>

  <ul className="space-y-2 text-sm">
    <li>
      <Link
        to="/"
        className="text-gray-600 hover:text-primary transition"
      >
        Home
      </Link>
    </li>

    <li>
      <Link
        to="/products"
        className="text-gray-600 hover:text-primary transition"
      >
        Products
      </Link>
    </li>

    <li>
      <Link
        to="/recipes"
        className="text-gray-600 hover:text-primary transition"
      >
        Recipes
      </Link>
    </li>
  </ul>
</div>

        <div>
  <h4 className="font-semibold mb-3 text-gray-800">
    Contact
  </h4>

  <div className="space-y-2 text-sm text-gray-600">
    <p>
      <span className="font-medium text-gray-700">Email:</span>{" "}
      <a
        href="mailto:support@milletstore.com"
        className="hover:text-primary transition"
      >
        support@milletstore.com
      </a>
    </p>

    <p>
      <span className="font-medium text-gray-700">Phone:</span>{" "}
      <a
        href="tel:+919000000000"
        className="hover:text-primary transition"
      >
        +91 90000 00000
      </a>
    </p>
  </div>
</div>
      </div>

      <div className="text-center text-xs text-gray-600 py-4 border shadow-sm">
        © {new Date().getFullYear()} MilletStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
