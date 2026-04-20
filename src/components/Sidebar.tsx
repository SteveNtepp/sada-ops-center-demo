'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard, Map, Users, Headphones, Brain, Settings,
  ChevronLeft, ChevronRight, LogOut, Zap
} from 'lucide-react';

interface NavItem { label: string; href: string; icon: React.ReactNode; roles: UserRole[]; }

const navItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: <LayoutDashboard size={18} />, roles: ['CEO', 'Manager', 'Sales', 'Support'] },
  { label: 'Carte Thermique', href: '/heatmap', icon: <Map size={18} />, roles: ['CEO', 'Manager', 'Sales'] },
  { label: 'CRM Terrain', href: '/crm', icon: <Users size={18} />, roles: ['CEO', 'Manager', 'Sales'] },
  { label: 'Support Hub', href: '/support', icon: <Headphones size={18} />, roles: ['CEO', 'Manager', 'Support'] },
  { label: 'Centre IA', href: '/ia-command', icon: <Brain size={18} />, roles: ['CEO', 'Manager'] },
  { label: 'Administration', href: '/admin', icon: <Settings size={18} />, roles: ['CEO', 'Manager'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = navItems.filter(item =>
    user ? item.roles.includes(user.role) : true
  );

  return (
    <aside
      className="sidebar flex flex-col transition-all duration-300 select-none h-screen sticky top-0 z-40"
      style={{ width: collapsed ? 72 : 240, minWidth: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <span className="font-bold text-white text-base tracking-tight">SADA</span>
            <span className="block text-xs text-gray-400 font-medium leading-none mt-0.5">Ops Center</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="animate-fade-in whitespace-nowrap">{item.label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.avatar}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                <p className="text-gray-400 text-xs truncate">{user.role}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors" title="Déconnexion">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
