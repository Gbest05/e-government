import React, { useState, useEffect } from 'react';
import { announcementsService } from '../../services/api';
import { Megaphone, Calendar, Users, Search, Pin, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);

  const categories = ['All', 'Public Notice', 'Health & Safety', 'Tax & Revenue', 'Community Development'];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementsService.getAnnouncements({});
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = announcements.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Official Council Bulletin</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Notices & Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Stay informed with verified updates, health advisories, revenue assessment exercises, and civic programs from Remo North Local Government.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements by keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-civic-800 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching council announcements..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No announcements found"
            description="There are currently no published bulletins matching your search criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between group ${
                  item.is_pinned
                    ? 'border-amber-300 shadow-md ring-1 ring-amber-100'
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-civic-50 text-civic-800 border border-civic-200">
                        {item.category}
                      </span>
                      {item.is_pinned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Pin className="w-3 h-3 text-amber-600" /> Pinned
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.publish_date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-civic-800 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{item.target_audience}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAnnouncement(item)}
                    className="font-bold text-civic-800 hover:text-civic-900 flex items-center gap-1"
                  >
                    <span>Read Notice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={!!activeAnnouncement}
          onClose={() => setActiveAnnouncement(null)}
          title={activeAnnouncement?.category || 'Announcement'}
          maxWidth="max-w-2xl"
        >
          {activeAnnouncement && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100">
                <span>Published: {new Date(activeAnnouncement.publish_date).toLocaleDateString()}</span>
                <span>Audience: <strong>{activeAnnouncement.target_audience}</strong></span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {activeAnnouncement.title}
              </h2>

              <div className="text-xs text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                {activeAnnouncement.content}
              </div>

              {activeAnnouncement.author_name && (
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Issued by: <strong className="text-slate-800">{activeAnnouncement.author_name}</strong>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
