import React, { useState, useEffect } from 'react';
import { departmentsService } from '../../services/api';
import { Building2, Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    head_name: '',
    contact_email: '',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentsService.getDepartments({ all: true });
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingDept(null);
    setForm({ name: '', code: '', description: '', head_name: '', contact_email: '', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setForm({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      head_name: dept.head_name || '',
      contact_email: dept.contact_email || '',
      is_active: dept.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingDept) {
        await departmentsService.updateDepartment(editingDept.id, form);
      } else {
        await departmentsService.createDepartment(form);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save department.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Governance Structure</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Council Departments Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define and manage Remo North Local Government administrative and operational divisions.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching departments..." />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments configured"
          description="Create local government departments to organize services and assign staff."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-civic-50 text-civic-800 border border-civic-200">
                    CODE: {dept.code}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dept.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {dept.description || 'General local council operations and citizen services.'}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Head of Dept:</span>
                    <strong className="text-slate-800">{dept.head_name || 'Not assigned'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Contact Email:</span>
                    <strong className="text-slate-800 font-mono text-[11px]">{dept.contact_email || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 text-[11px]">Active Services:</span>
                    <strong className="text-civic-800">{dept.services_count} services</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(dept)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
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
        title={editingDept ? 'Edit Council Department' : 'Create New Department'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Works and Infrastructure"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department Code *</label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. WORKS"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Head of Department (HOD) Name</label>
            <input
              type="text"
              value={form.head_name}
              onChange={(e) => setForm({ ...form, head_name: e.target.value })}
              placeholder="e.g. Engr. Babatunde Sowunmi"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Contact Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              placeholder="e.g. works@remonorth.og.gov.ng"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Scope</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Responsibilities, municipal infrastructure, and regulatory scope..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active_dept"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-civic-800"
            />
            <label htmlFor="is_active_dept" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Department is active and operating
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
              {submitting ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDepartmentsPage;
