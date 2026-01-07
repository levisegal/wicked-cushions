import Image from "next/image";

export default function Header() {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0">
          <button className="hidden md:flex items-center gap-1 text-white hover:text-gray-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2"/></svg>
            <span>US/ $</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="text-center text-xs md:text-sm">
            Free shipping for orders <span className="font-bold text-[#ff6633]">OVER $40</span> in The US
          </div>
          <div className="hidden md:flex gap-4">
            <a href="#" className="hover:text-gray-300">Warranty</a>
            <a href="#" className="hover:text-gray-300">Returns & Refunds</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/logo.svg"
                alt="Wicked Cushions"
                width={50}
                height={50}
                className="w-12 h-12"
              />
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find your product..."
                  className="w-full px-4 py-3 border-2 border-[#ff6633] rounded-lg pr-12"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff6633]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center gap-2 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" strokeWidth="2"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeWidth="2" strokeLinecap="round"/></svg>
                <span className="hidden sm:inline">Hey! Log In</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>0</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 mt-4 text-sm">
            <button className="flex items-center gap-1 hover:text-[#ff6633]">
              <span>☰</span>
              SHOP
            </button>
            <a href="#" className="hover:text-[#ff6633]">VIDEO TUTORIALS</a>
            <a href="#" className="hover:text-[#ff6633]">OUR REVIEWS</a>
            <a href="#" className="hover:text-[#ff6633]">ABOUT US</a>
            <a href="#" className="hover:text-[#ff6633]">SUPPORT</a>
          </nav>
          
          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center justify-center gap-4 mt-3 text-xs overflow-x-auto">
            <button className="flex items-center gap-1 hover:text-[#ff6633] whitespace-nowrap">
              <span>☰</span>
              SHOP
            </button>
            <a href="#" className="hover:text-[#ff6633] whitespace-nowrap">TUTORIALS</a>
            <a href="#" className="hover:text-[#ff6633] whitespace-nowrap">REVIEWS</a>
            <a href="#" className="hover:text-[#ff6633] whitespace-nowrap">ABOUT</a>
          </nav>
        </div>
      </header>
    </>
  );
}

