import React, { useState, useEffect } from 'react';
import { notificationsService } from '../../services/api';
import { Bell, Check, Clock, CheckCircle2, AlertTriangle, FileText, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const iconMap = {
  application: FileText,
  report: AlertTriangle,
  complaint: MessageSquare,
  system: Bell,
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsService.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Alerts & Notices</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Notifications Center
          </h1>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 bg-civic-50 hover:bg-civic-100 text-civic-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are all caught up! You'll receive updates here when there are status changes on your applications or reports."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {notifications.map((notif) => {
            const Icon = iconMap[notif.notification_type] || Bell;
            return (
              <div
                key={notif.id}
                className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                  notif.is_read ? 'bg-white' : 'bg-civic-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.is_read
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-civic-100 text-civic-800 ring-2 ring-civic-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-civic-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      {new Date(notif.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-civic-700 hover:bg-slate-100 rounded-lg shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
