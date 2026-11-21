import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Droplet, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmergencyRequestModal } from '../common/EmergencyRequestModal';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Find Donors', path: '/find-donors' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        {/* Top Emergency Advisory Bar */}
        <div className="bg-[#991B1B] text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>Need Emergency Blood Immediately?</span>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="underline hover:text-red-100 font-bold ml-1 transition-colors"
          >
            Broadcast Request Now
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#0F172A] leading-tight flex items-center gap-0.5">
                  Medi<span className="text-[#DC2626]">Connect</span>
                </span>
                <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase">
                  Healthcare Blood Grid
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-[#DC2626] bg-[#FEE2E2]/60'
                        : 'text-[#0F172A] hover:text-[#DC2626] hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="text-[#DC2626] border-[#DC2626] hover:bg-[#FEE2E2]/50 font-bold"
                icon={AlertCircle}
              >
                Request Blood
              </Button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                icon={LogIn}
              >
                Sign In
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
                icon={UserPlus}
              >
                Register
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="text-xs px-2.5 py-1.5"
              >
                SOS
              </Button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3.5 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                      isActive
                        ? 'text-[#DC2626] bg-[#FEE2E2]'
                        : 'text-[#0F172A] hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2">
              <Button
                variant="outline"
                size="md"
                className="w-full text-[#DC2626] border-[#DC2626]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEmergencyModalOpen(true);
                }}
                icon={AlertCircle}
              >
                Emergency Blood Request
              </Button>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  icon={LogIn}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  icon={UserPlus}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Emergency Request Modal */}
      <EmergencyRequestModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
};
