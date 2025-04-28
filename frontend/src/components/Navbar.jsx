import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, LogOut, LogIn, Home, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();


  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "py-2 bg-[#121212]/90 backdrop-blur-lg" : "py-4 bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">SmartAnalyse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="mr-8 flex space-x-1">
              <NavLink to="/" isActive={isActive("/")} icon={<Home size={18} />}>
                Home
              </NavLink>

              {isLoggedIn ? (
                <>
                  <NavLink to="/dashboard" isActive={isActive("/dashboard")} icon={<LayoutDashboard size={18} />}>
                    Dashboard
                  </NavLink>
                  <button
                    onClick={toggleLogin}
                    className="flex items-center px-4 py-2 text-gray-300 hover:text-white rounded-full transition-colors"
                  >
                    <LogOut size={18} className="mr-1" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" isActive={isActive("/login")} icon={<LogIn size={18} />}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" isActive={isActive("/signup")}>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>

            <Link
              to="/home"
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Try Now <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                <Home size={18} className="mr-2" /> Home
              </MobileNavLink>

              {isLoggedIn ? (
                <>
                  <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard size={18} className="mr-2" /> Dashboard
                  </MobileNavLink>
                  <button
                    onClick={() => {
                      toggleLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <LogOut size={18} className="mr-2" /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn size={18} className="mr-2" /> Login
                  </MobileNavLink>
                  <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </MobileNavLink>
                </>
              )}

              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg transition-colors mt-2"
              >
                Try Now <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Desktop nav link component
const NavLink = ({ to, children, isActive, icon }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-full transition-colors ${
      isActive
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
    }`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {children}
  </Link>
);

// Mobile nav link component
const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;