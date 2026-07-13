import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LayoutTemplate, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/blog', label: 'Artikel Blog', icon: FileText },
  { to: '/admin/pages', label: 'Edit Halaman', icon: LayoutTemplate },
];

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumb?: string;
}

export const AdminLayout = ({ children, title, breadcrumb }: AdminLayoutProps) => {
  const { user, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <aside className={`
      fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-white transition-transform duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-[#7A9A01] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <div>
          <div className="font-bold text-sm text-white leading-tight">Palmtrees Admin</div>
          <div className="text-xs text-slate-400">Panel Pengelolaan</div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#7A9A01] text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-2">
        <div className="px-3 py-2">
          <div className="text-xs text-slate-400">Login sebagai</div>
          <div className="text-sm font-medium text-white truncate">{user?.email}</div>
        </div>
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LayoutTemplate className="w-4 h-4" />
          Lihat Website
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-900/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64">
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          {breadcrumb && (
            <div className="text-xs text-slate-400 mb-0.5">{breadcrumb}</div>
          )}
          {title && (
            <h1 className="text-base font-bold text-slate-800 truncate">{title}</h1>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
};
