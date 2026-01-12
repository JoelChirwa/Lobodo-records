import React, { useState, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MusicalNoteIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  PhoneIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useAuthWithNavigate } from "../../context/AuthContext";
import lobodoLogo from "../../assets/lobodo.png";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Productions", href: "/productions", icon: MusicalNoteIcon },
  { name: "Booking", href: "/booking", icon: CalendarDaysIcon },
  { name: "Contact", href: "/contact", icon: PhoneIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuthWithNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <Disclosure as="nav" className="glass-effect sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-3 group/logo">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-28 h-28 rounded-lg overflow-hidden"
                  >
                    <img
                      src={lobodoLogo}
                      alt="Lobodo Records"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </Link>
              </div>

              {/* Desktop Navigation - Right Aligned */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        isActive
                          ? "bg-primary/10 text-primary border-primary"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/5",
                        "group flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/10 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/10",
                      "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
