import React from "react";
import { Link } from "react-router-dom";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-effect border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center mr-3">
              <MusicalNoteIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">Lobodo Records</h2>
              <p className="text-text-secondary text-xs">
                Step Ahead Complex, Kawale
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link
              to="/"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              to="/productions"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Productions
            </Link>
            <Link
              to="/booking"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Booking
            </Link>
            <Link
              to="/contact"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-text-secondary text-sm">
              © {currentYear} Lobodo Records
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
