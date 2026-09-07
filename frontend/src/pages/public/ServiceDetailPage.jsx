import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesService } from '../../services/api';
import { 
  FileText, 
  Clock, 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await servicesService.getServiceById(id);
        setService(res.data.service);
      } catch (err) {
        setError('The requested service could not be loaded or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-20"><LoadingSpinner message="Loading service details..." /></div>;
  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">{error || 'Service Not Found'}</h2>
          <Link to="/services" className="inline-block px-4 py-2 bg-civic-800 text-white rounded-lg text-xs font-semibold">
            &larr; Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-civic-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Government Services</span>
        </Link>

        {/* Main Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-civic-50 text-civic-800 border border-civic-200">
                  {service.code}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {service.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {service.name}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Issuing Authority: <strong className="text-slate-700">{service.department_name}</strong></span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-right md:text-left shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Statutory Fee</span>
              <span className="text-2xl font-black text-slate-900 block">
                {service.fee_naira > 0 ? `₦${service.fee_naira.toLocaleString()}` : 'Free'}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 mt-1 justify-end md:justify-start">
                <Clock className="w-3.5 h-3.5 text-civic-600" />
                <span>Estimated {service.expected_days} Business Days</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Service Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {service.full_description || service.short_description}
            </p>
          </div>

          {/* Eligibility */}
          {service.eligibility && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Eligibility Criteria</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {service.eligibility}
              </p>
            </div>
          )}

          {/* Grid of Requirements and Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Required Information */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-civic-700" />
                <span>Required Information</span>
              </h3>
              {service.requirements && service.requirements.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-600">
                  {service.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-civic-600 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Standard citizen details required.</p>
              )}
            </div>

            {/* Required Documents */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-civic-700" />
                <span>Required Supporting Documents</span>
              </h3>
              {service.required_documents && service.required_documents.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-600">
                  {service.required_documents.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">No special documents required.</p>
              )}
            </div>
          </div>

          {/* Processing Workflow Steps */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Application & Processing Workflow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {service.processing_steps && service.processing_steps.map((step, idx) => (
                <div key={step} className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[11px] font-mono font-bold text-slate-400 block mb-1">
                    STEP {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 leading-tight block">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              * Applications are reviewed by council officers during official business days (8:00 AM - 4:00 PM).
            </div>
            <Link
              to={`/citizen/apply?service_id=${service.id}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Begin Online Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
