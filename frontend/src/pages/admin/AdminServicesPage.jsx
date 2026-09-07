import React, { useState, useEffect } from 'react';
import { servicesService, departmentsService } from '../../services/api';
import { FolderOpen, Plus, Edit, Trash2, CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'Certificates',
    department_id: '',
    short_description: '',
    full_description: '',
    eligibility: '',
    fee_naira: 0,
    expected_days: 3,
    requirements_text: '',
    documents_text: '',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Certificates',
    'Business & Trade',
    'Community & Social',
    'Environment & Sanitation',
    'Infrastructure & Works'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [srvRes, deptRes] = await Promise.all([
        servicesService.getServices({ all: true }),
        departmentsService.getDepartments({})
      ]);
      setServices(srvRes.data.services || []);
      setDepartments(deptRes.data.departments || []);
      if (deptRes.data.departments?.length > 0) {
        setForm(f => ({ ...f, department_id: deptRes.data.departments[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      name: '',
      code: '',
      category: 'Certificates',
      department_id: departments[0]?.id || '',
      short_description: '',
      full_description: '',
      eligibility: '',
      fee_naira: 0,
      expected_days: 3,
      requirements_text: 'Valid National Identity Number (NIN)\nProof of Ward Residency',
      documents_text: 'NIN Slip\nPassport Photograph',
      is_active: true
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      code: service.code,
      category: service.category,
      department_id: service.department_id,
      short_description: service.short_description,
      full_description: service.full_description || '',
      eligibility: service.eligibility || '',
      fee_naira: service.fee_naira,
      expected_days: service.expected_days,
      requirements_text: (service.requirements || []).join('\n'),
      documents_text: (service.required_documents || []).join('\n'),
      is_active: service.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      code: form.code,
      category: form.category,
      department_id: form.department_id,
      short_description: form.short_description,
      full_description: form.full_description,
      eligibility: form.eligibility,
      fee_naira: parseFloat(form.fee_naira),
      expected_days: parseInt(form.expected_days),
      requirements: form.requirements_text.split('\n').map(s => s.trim()).filter(Boolean),
      required_documents: form.documents_text.split('\n').map(s => s.trim()).filter(Boolean),
      is_active: form.is_active
    };

    try {
      if (editingService) {
        await servicesService.updateService(editingService.id, payload);
      } else {
        await servicesService.createService(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (srv) => {
    try {
      await servicesService.deleteService(srv.id);
      fetchData();
    } catch (err) {
      alert('Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Municipal Catalog</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Government Services Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure council certificates, permits, statutory fees, required documents, and turnaround timelines.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading services configuration..." />
      ) : services.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No services configured"
          description="Create government services to enable citizen online applications."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Service Name & Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Fee (₦)</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{srv.name}</div>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{srv.code}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {srv.department_name}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {srv.fee_naira > 0 ? `₦${srv.fee_naira.toLocaleString()}` : 'Free'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {srv.expected_days}d
                    </td>
                    <td className="py-3.5 px-4">
                      {srv.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="px-2.5 py-1 text-xs font-bold text-civic-800 bg-civic-50 hover:bg-civic-100 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(srv)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                          srv.is_active
                            ? 'text-rose-700 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {srv.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingService ? 'Edit Government Service' : 'Create Government Service'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Certificate of Local Government Origin"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. RMN-SRV-ORIGIN"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono focus:bg-white focus:ring-2 focus:ring-civic-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800 font-medium"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Responsible Department *</label>
              <select
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800 font-medium"
              >
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fee in Naira (₦)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={form.fee_naira}
                onChange={(e) => setForm({ ...form, fee_naira: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Turnaround Days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.expected_days}
                onChange={(e) => setForm({ ...form, expected_days: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary *</label>
            <input
              type="text"
              required
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="Brief 1-sentence explanation of service purpose..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={2}
              value={form.full_description}
              onChange={(e) => setForm({ ...form, full_description: e.target.value })}
              placeholder="Comprehensive description of the service and legal mandate..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
            <input
              type="text"
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              placeholder="e.g. Bonafide indigenes of Remo North LGA or local business operators"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Info (One per line)
              </label>
              <textarea
                rows={3}
                value={form.requirements_text}
                onChange={(e) => setForm({ ...form, requirements_text: e.target.value })}
                placeholder="NIN Number&#10;Ward Recommendation"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Uploads (One per line)
              </label>
              <textarea
                rows={3}
                value={form.documents_text}
                onChange={(e) => setForm({ ...form, documents_text: e.target.value })}
                placeholder="NIN Slip&#10;Passport Photo"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active_srv"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-civic-800"
            />
            <label htmlFor="is_active_srv" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Service is active and visible on public portal
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
              {submitting ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServicesPage;
