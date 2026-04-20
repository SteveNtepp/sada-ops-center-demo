'use client';
import React from 'react';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/lib/themeContext';
import { Bell, Sun, Moon, Search } from 'lucide-react';
import { mockTickets } from '@/lib/mockData';
import { isP1Alert } from '@/lib/mockData';

export default function Header({ title }: { title: string }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const p1Alerts = mockTickets.filter(isP1Alert).length;

  return (
    <header
      className="flex items-center gap-4 px-6 py-4 border-b sticky top-0 z-30"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div className="flex-1">
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {user && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Bonjour, {user.name.split(' ')[0]} · {user.zone}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={14} className="absolute left-3" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Rechercher..."
          className="input pl-9 pr-4 py-2 text-sm w-56"
        />
      </div>

      {/* Alerts */}
      <button className="relative p-2 rounded-lg transition-colors hover:bg-orange-50 dark:hover:bg-orange-500/10">
        <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
        {p1Alerts > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {p1Alerts}
          </span>
        )}
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="p-2 rounded-lg transition-all hover:bg-orange-50 dark:hover:bg-white/5"
        title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
      >
        {theme === 'light'
          ? <Moon size={18} style={{ color: 'var(--text-secondary)' }} />
          : <Sun size={18} className="text-yellow-400" />
        }
      </button>

      {/* User avatar */}
      {user && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user.avatar}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
          </div>
        </div>
      )}
    </header>
  );
}
