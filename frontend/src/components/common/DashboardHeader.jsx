import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationsService } from '../../services/api';
import { Menu, Bell, Check, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHeader = ({ onToggleSidebar, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsService.getNotifications();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 minute poll
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell with Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-civic-700 hover:text-civic-900 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors ${
                        notif.is_read ? 'bg-white' : 'bg-civic-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <Link
                  to={user?.role === 'admin' ? '/admin/notifications' : user?.role === 'staff' ? '/staff/notifications' : '/citizen/notifications'}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-civic-700 hover:text-civic-800"
                >
                  View all notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-civic-800 text-white font-bold text-xs flex items-center justify-center">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-800 block truncate max-w-[130px]">
              {user?.full_name}
            </span>
            <span className="text-[10px] font-semibold text-civic-700 uppercase tracking-wider block">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
