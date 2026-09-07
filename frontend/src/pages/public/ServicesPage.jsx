import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { servicesService, departmentsService } from '../../services/api';
import { 
  Search, 
  Filter, 
  Clock, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Wrench, 
  Users, 
  Baby, 
  Calendar 
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const categoryIcons = {
  'Certificates': FileText,
  'Business & Trade': Building2,
  'Community & Social': Users,
  'Environment & Sanitation': ShieldCheck,
  'Infrastructure & Works': Wrench,
};

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDept, setSelectedDept] = useState('All');

  const categories = [
    'All',
    'Certificates',
    'Business & Trade',
    'Community & Social',
    'Environment & Sanitation',
    'Infrastructure & Works'
  ];

  useEffect(() => {
    fetchServicesAndDepts();
  }, []);

  const fetchServicesAndDepts = async () => {
    setLoading(true);
    try {
      const [srvRes, deptRes] = await Promise.all([
        servicesService.getServices({}),
        departmentsService.getDepartments({})
      ]);
      setServices(srvRes.data.services || []);
      setDepartments(deptRes.data.departments || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesDept = selectedDept === 'All' || String(service.department_id) === String(selectedDept);
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Official Citizen Directory</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Government Services Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Explore official certificates, business licenses, social accreditations, and municipal permits provided by Remo North Local Government.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by service name, code, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600 focus:border-transparent"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600 text-slate-700"
              >
                <option value="All">All Council Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-civic-800 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services List Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching council services..." />
        ) : filteredServices.length === 0 ? (
          <EmptyState
            title="No services match your search"
            description="Try changing your search terms or selecting 'All' categories."
            action={
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDept('All');
                }}
                className="px-4 py-2 bg-civic-800 text-white text-xs font-semibold rounded-lg hover:bg-civic-900"
              >
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const Icon = categoryIcons[service.category] || FileText;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Category and Processing timeline */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {service.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-civic-600" />
                        <span>{service.expected_days} Days</span>
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-800 flex items-center justify-center shrink-0 border border-civic-100 group-hover:bg-civic-800 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-civic-700 block uppercase tracking-wider">
                          {service.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-civic-800 transition-colors">
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {service.short_description}
                    </p>

                    {/* Department badge */}
                    <div className="text-[11px] text-slate-400 mb-4 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{service.department_name}</span>
                    </div>

                    {/* Requirements summary pill */}
                    {service.requirements && service.requirements.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1">
                        <span className="font-semibold text-slate-800 block text-[11px]">Key Requirements:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                          {service.requirements.slice(0, 2).map((req, idx) => (
                            <li key={idx} className="truncate">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Processing Fee</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {service.fee_naira > 0 ? `₦${service.fee_naira.toLocaleString()}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/services/${service.id}`}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/citizen/apply?service_id=${service.id}`}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-civic-800 hover:bg-civic-900 rounded-lg transition-colors shadow-sm"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
