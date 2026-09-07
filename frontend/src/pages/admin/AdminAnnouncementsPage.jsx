import React, { useState, useEffect } from 'react';
import { announcementsService } from '../../services/api';
import { Megaphone, Plus, Edit, Trash2, Pin, Calendar, Users, Eye } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const AdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Public Notice',
    content: '',
    target_audience: 'All Citizens',
    is_pinned: false,
    is_published: true
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Public Notice', 'Health & Safety', 'Tax & Revenue', 'Infrastructure', 'Community Development', 'Town Hall'];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementsService.getAnnouncements({ all: true });
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingAnn(null);
    setForm({
      title: '',
      category: 'Public Notice',
      content: '',
      target_audience: 'All Citizens',
      is_pinned: false,
      is_published: true
    });
    setShowModal(true);
  };

  const openEdit = (ann) => {
    setEditingAnn(ann);
    setForm({
      title: ann.title,
      category: ann.category,
      content: ann.content,
      target_audience: ann.target_audience,
      is_pinned: ann.is_pinned,
      is_published: ann.is_published
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAnn) {
        await announcementsService.updateAnnouncement(editingAnn.id, form);
      } else {
        await announcementsService.createAnnouncement(form);
      }
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to save announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ann) => {
    if (!window.confirm(`Delete notice "${ann.title}"?`)) return;
    try {
      await announcementsService.deleteAnnouncement(ann.id);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to delete announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Public Communications</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Council Announcements Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish public advisories, sanitation notices, health campaigns, and council town hall schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching announcements..." />
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No notices published"
          description="Create and publish your first official council announcement."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                item.is_pinned ? 'border-amber-300 shadow-md ring-1 ring-amber-100' : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-civic-50 text-civic-800 border border-civic-200">
                      {item.category}
                    </span>
                    {item.is_pinned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-amber-600" /> Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.publish_date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.content}
                </p>

                <div className="text-[11px] text-slate-400">
                  Target: <strong>{item.target_audience}</strong>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAnn ? 'Edit Council Bulletin' : 'Publish New Council Notice'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Monthly Environmental Sanitation Exercise"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800 font-medium"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={form.target_audience}
                onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                placeholder="e.g. All Citizens, Traders"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content *</label>
            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the complete official notice text..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_pinned}
                onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                className="w-4 h-4 rounded text-civic-800"
              />
              <span>Pin to top of portal</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="w-4 h-4 rounded text-civic-800"
              />
              <span>Published & Visible</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-civic-800 hover:bg-civic-900 text-white rounded-xl text-xs font-bold shadow"
            >
              {submitting ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncementsPage;
