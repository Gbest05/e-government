import React, { useState, useEffect } from 'react';
import { adminService, departmentsService } from '../../services/api';
import { UserCheck, Plus, Search, Building2, CheckCircle2, XCircle, Edit, KeyRound } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const AdminStaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    department_id: '',
    role: 'staff'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, deptsRes] = await Promise.all([
        adminService.getUsers({ role: 'staff', per_page: 50 }),
        departmentsService.getDepartments({})
      ]);
      setStaffList(staffRes.data.users || []);
      setDepartments(deptsRes.data.departments || []);
      if (deptsRes.data.departments?.length > 0) {
        setForm(f => ({ ...f, department_id: deptsRes.data.departments[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await adminService.createStaff(form);
      setShowAddModal(false);
      setForm({ full_name: '', email: '', phone: '', password: '', department_id: departments[0]?.id || '', role: 'staff' });
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to create staff account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (staff) => {
    const action = staff.is_active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${staff.full_name}'s officer access?`)) return;

    try {
      await adminService.toggleUserStatus(staff.id);
      setStaffList(staffList.map(s => s.id === staff.id ? { ...s, is_active: !s.is_active } : s));
    } catch (err) {
      alert('Failed to toggle staff status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Human Resources</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Government Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create officer accounts, assign council departmental portfolios, and manage active service access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading council staff roster..." />
      ) : staffList.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No staff members registered"
          description="Add officers to process applications and manage departmental community reports."
          action={
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-civic-800 text-white text-xs font-semibold rounded-lg"
            >
              Add Staff
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-4">Official Email</th>
                  <th className="py-3 px-4">Assigned Department</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {st.full_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {st.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{st.department_name || 'General Secretariat'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {st.phone || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      {st.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(st)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          st.is_active
                            ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                            : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        {st.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Council Staff Officer"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Officer Full Name *</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="e.g. Engr. Oladipo Johnson"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. works.officer@remonorth.og.gov.ng"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 08034445566"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Department *</label>
              <select
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password * (min 6)</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create initial login password"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-civic-800 hover:bg-civic-900 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Staff Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStaffPage;
