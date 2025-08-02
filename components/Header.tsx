'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Play, TrendingUp, Star, Clock, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Play },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
    { href: '/popular', label: 'Popular', icon: Star },
    { href: '/recent', label: 'Recent', icon: Clock },
    { href: '/community', label: 'Community', icon: Users },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AnimeStream</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/watchlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Watchlist
                  </Link>
                  <Link
                    href="/history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Watch History
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
            
            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <Link
                href="/profile"
                className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/watchlist"
                className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-5 h-5" />
                <span>Watchlist</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};