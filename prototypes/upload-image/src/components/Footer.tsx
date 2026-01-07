import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Follow Us */}
          <div>
            <h3 className="font-display text-lg mb-4">Follow us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">f</a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">📷</a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">▶</a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">X</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Earpads</a></li>
              <li><a href="#" className="hover:text-white">Sweat Covers</a></li>
              <li><a href="#" className="hover:text-white">Headbands</a></li>
              <li><a href="#" className="hover:text-white">Arctis Nova Plates</a></li>
              <li><a href="#" className="hover:text-white">Earbuds Earhooks</a></li>
              <li><a href="#" className="hover:text-white">Earbuds Foam Tips</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-display text-lg mb-4">About</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Our Reviews</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Video Tutorials</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Wholesale & Bulk Order Requests</a></li>
              <li><a href="#" className="hover:text-white">Warranty Information</a></li>
              <li><a href="#" className="hover:text-white">Returns and Refunds</a></li>
              <li><a href="#" className="hover:text-white">FAQ's</a></li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="text-2xl mb-2">⭐</div>
              <div>50,000+ Customer Reviews Online</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🎧</div>
              <div>1,500,000+ Earpads Replaced and Counting...</div>
            </div>
            <div>
              <div className="text-2xl mb-2">❤️</div>
              <div>365 Days to Fall in Love Warranty</div>
            </div>
            <div>
              <div className="text-2xl mb-2">⏱️</div>
              <div>Flawless, Step by Step, 5 Minute Installation</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.svg" alt="Wicked Cushions" width={40} height={40} />
            <span>© 2025 Wicked Cushions. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Sitemap</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

