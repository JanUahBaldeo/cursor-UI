import { motion, AnimatePresence } from 'framer-motion';
import SearchBox from './SearchBox';
import ProfileInfo from './ProfileInfo';
import NotificationDropdown from './dashboard/NotificationDropdown';
import { useUser } from '../context/UserContext';
import { useState, useRef, useEffect } from 'react';
import { HiUser, HiOutlineBell, HiChevronDown } from 'react-icons/hi';

const roles = [
  { label: 'Loan Officer', icon: <HiUser className="inline mr-1" /> },
  { label: 'LOA / Processor', icon: <HiUser className="inline mr-1" /> },
  { label: 'Production Partner', icon: <HiUser className="inline mr-1" /> },
];

const HEADER_HEIGHT = 96; // px, adjust if needed (6rem)

const Header = () => {
  const { user, role, setRole } = useUser();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPulse, setNotifPulse] = useState(true);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const roleBtnRef = useRef(null);
  const unreadCount = 2; // Sync with NotificationDropdown mock

  const displayName = user?.name || 'Admin User';
  const userRole = role || user?.tier || 'User';
  const greeting = `Welcome back, ${displayName}`;
  const subtext =
    userRole.toLowerCase() === 'admin'
      ? 'Here’s a full overview of your system insights today'
      : 'Let’s take a detailed look at your financial situation today';

  // Find the role object for icon
  const roleObj = roles.find(r => r.label === userRole) || { label: userRole, icon: <HiUser className="inline mr-1" /> };

  // Keyboard accessibility for custom dropdown
  const handleRoleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setRoleDropdown((v) => !v);
    } else if (e.key === 'Escape') {
      setRoleDropdown(false);
    }
  };

  // Listen for scroll to add blur/shadow
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 bg-[#01818E] text-white transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-[#01818E]/90 shadow-2xl' : 'backdrop-blur-sm bg-[#01818E]/95 shadow-md'}`}
      style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }}
    >
      {/* Gradient overlay for glassmorphism */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#01818E]/90 via-cyan-700/80 to-[#01818E]/90 opacity-80" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col md:flex-row items-center justify-between gap-y-4 gap-x-10 px-4 sm:px-8 py-4 sm:py-6"
      >
        {/* Left: Logo + Welcome + Role Badge */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, type: 'spring' }}
          className="flex items-center gap-4 md:gap-6 min-w-0"
        >
          <motion.img
            src="https://i.ibb.co/rK44TsnC/logo.png"
            alt="logo"
            className="h-14 w-14 md:h-16 md:w-16 object-contain rounded-2xl shadow-lg bg-white/20 p-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.h1
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
              {greeting}
              </motion.h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm font-semibold ml-1 border border-white/30 shadow-sm gap-1">
                {roleObj.icon}
                {roleObj.label}
              </span>
            </div>
            <p className="text-sm sm:text-base font-light text-white/80 mt-1 truncate">
              {subtext}
            </p>
          </div>
        </motion.div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 sm:gap-5 md:gap-7 ml-auto">
          {/* Search Bar (pill, shadow) */}
          <div className="flex items-center">
            <SearchBox className="rounded-full shadow-md bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-300 border-none" inputClassName="rounded-full px-5 py-2" iconClassName="transition-transform duration-200 group-focus-within:scale-110" />
          </div>
          {/* Custom Role Switcher (pill) */}
          <div className="relative group" tabIndex={0} onBlur={() => setRoleDropdown(false)}>
            <button
              ref={roleBtnRef}
              type="button"
              className={`flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 border border-white/30 text-sm text-white shadow-md font-semibold focus:bg-white/30 focus:text-white transition focus:ring-2 focus:ring-cyan-200 hover:bg-white/30 outline-none ${roleDropdown ? 'ring-2 ring-cyan-200' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={roleDropdown}
              onClick={() => setRoleDropdown((v) => !v)}
              onKeyDown={handleRoleKeyDown}
            >
              {roleObj.icon}
              {roleObj.label}
              <HiChevronDown className={`ml-1 text-base transition-transform duration-200 ${roleDropdown ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {roleDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-56 bg-white text-cyan-900 rounded-xl shadow-xl border border-cyan-100 z-50 overflow-hidden animate-fade-in"
                  role="listbox"
                  tabIndex={-1}
                >
                  <li className="px-5 py-3 text-xs text-gray-400 select-none">Select Role</li>
                  {roles.map((r) => (
                    <li
                      key={r.label}
                      className={`flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-cyan-50 focus:bg-cyan-100 transition text-base font-medium ${userRole === r.label ? 'bg-cyan-100 text-cyan-700' : ''}`}
                      role="option"
                      aria-selected={userRole === r.label}
                      tabIndex={0}
                      onClick={() => { setRole(r.label); setRoleDropdown(false); }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setRole(r.label); setRoleDropdown(false);
                        }
                      }}
                    >
                      {r.icon}
                      {r.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          {/* Notifications */}
          <div className="relative group">
            <button
              className={`relative p-2 rounded-full hover:bg-white/20 transition focus:ring-2 focus:ring-cyan-200 ${notifPulse && unreadCount > 0 ? 'animate-pulse' : ''}`}
              onClick={() => { setNotifOpen(v => !v); setNotifPulse(false); }}
              aria-label="Notifications"
              onMouseEnter={() => setNotifPulse(false)}
            >
              <HiOutlineBell className="text-white text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-200 text-cyan-900 text-xs rounded-full flex items-center justify-center border-2 border-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
              Notifications
            </span>
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
          {/* Profile Avatar/Dropdown */}
          <ProfileInfo avatarClassName="hover:ring-2 hover:ring-cyan-200 transition duration-200" dropdownAnimation />
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
