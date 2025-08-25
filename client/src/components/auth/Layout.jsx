import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side shopping promo panel */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight leading-snug">
            Welcome to <span className="text-yellow-300">ShopNow</span>
          </h1>
          <p className="text-lg text-gray-100 font-medium">
            Discover amazing deals, top brands, and the latest trends — all in
            one place.
          </p>
          <ul className="mt-6 space-y-3 text-base">
            <li>🛒 Shop your favorites with ease</li>
            <li>⚡ Fast & secure checkout</li>
            <li>🎁 Exclusive offers every day</li>
          </ul>
        </div>
      </div>

      {/* Right side form container */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
