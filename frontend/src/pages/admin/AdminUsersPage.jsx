import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Users, Search, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Eye } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchCitizens();
  }, [currentPage]);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        role: 'citizen',
        search: search,
        page: currentPage,
        per_page: 15
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCitizens();
  };

  const handleToggleStatus = async (user) => {
    const action = user.is_active ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.full_name}'s citizen account?`)) return;

    try {
      await adminService.toggleUserStatus(user.id);
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      alert('Failed to change user status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Administrative Management</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Citizens Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Search registered citizens across Remo North, inspect profiles, and manage account statuses.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search citizens by name, email, phone, community..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-civic-800 text-white font-semibold text-xs rounded-xl hover:bg-civic-900"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching citizens list..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No citizens found"
          description="No citizen accounts matched your search terms."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Citizen Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Community Area</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {citizen.full_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {citizen.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {citizen.phone || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {citizen.community_area || 'Isara-Remo'}
                    </td>
                    <td className="py-3.5 px-4">
                      {citizen.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(citizen)}
                        className="px-2.5 py-1 text-xs font-bold text-civic-800 bg-civic-50 hover:bg-civic-100 rounded-lg"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleToggleStatus(citizen)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                          citizen.is_active
                            ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                            : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        {citizen.is_active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Profile inspection modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Citizen Profile Record"
        maxWidth="max-w-md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full bg-civic-800 text-white font-black text-xl flex items-center justify-center mx-auto shadow">
                {selectedUser.full_name?.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{selectedUser.full_name}</h3>
              <p className="text-xs text-slate-400">{selectedUser.email}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <strong className="text-slate-800">{selectedUser.phone || 'N/A'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Community Ward:</span>
                <strong className="text-slate-800">{selectedUser.community_area}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Residential Address:</span>
                <strong className="text-slate-800 text-right max-w-[200px]">{selectedUser.address || 'Not provided'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered On:</span>
                <strong className="text-slate-800">{new Date(selectedUser.created_at).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              * Password hashes are securely encrypted with bcrypt and hidden for security compliance.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
