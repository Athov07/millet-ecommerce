const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-sm text-gray-600">

        <div>
          <h3 className="text-primary font-semibold mb-2">MilletStore</h3>
          <p>Healthy, organic millet products for a better lifestyle.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Products</li>
            <li>Recipes</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Email: support@milletstore.com</p>
          <p>Phone: +91 90000 00000</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-3 border-t">
        © {new Date().getFullYear()} MilletStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
