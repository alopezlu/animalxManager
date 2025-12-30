
import React, { useState } from 'react';
import DashboardIcon from './icons/DashboardIcon';
import UsersIcon from './icons/UsersIcon';
import MessageIcon from './icons/MessageIcon';
import Logo from './icons/Logo';
import SettingsIcon from './icons/SettingsIcon';

type View = 'dashboard' | 'members' | 'communications' | 'settings';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'members', label: 'Gestionar Miembros', icon: <UsersIcon /> },
    { id: 'communications', label: 'Comunicaciones', icon: <MessageIcon /> },
    { id: 'settings', label: 'Configuración', icon: <SettingsIcon /> },
  ];

  const NavLinks = () => (
    <nav>
      <ul>
        {navItems.map(item => (
          <li key={item.id}>
            <button
              onClick={() => {
                setView(item.id as View);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="ml-4 font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 p-4 z-20 flex justify-between items-center shadow-md">
        <Logo />
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`lg:hidden fixed inset-0 z-10 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-900/80 backdrop-blur-sm`}>
        <div className="w-64 h-full bg-gray-900 p-5 shadow-2xl pt-20">
             <NavLinks />
        </div>
      </div>


      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-900 p-5 flex-shrink-0 min-h-screen shadow-2xl">
        <div className="text-center mb-10">
          <Logo />
          <p className="text-sm text-gray-500 mt-2">Panel de Control</p>
        </div>
        <NavLinks />
      </aside>
    </>
  );
};

export default Sidebar;
