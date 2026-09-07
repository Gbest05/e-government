import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { getFileUrl } from '../../services/api';
import { servicesService, announcementsService } from '../../services/api';
import {
  Landmark,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Users,
  MapPin,
  ChevronDown,
  Megaphone,
  Sparkles,
  PhoneCall,
  Calendar
} from 'lucide-react';

const LandingPage = () => {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvRes, annRes] = await Promise.all([
          servicesService.getServices({}),
          announcementsService.getAnnouncements({})
        ]);
        setServices(srvRes.data.services || []);
        setAnnouncements(annRes.data.announcements || []);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const faqs = [
    {
      q: 'What is the Remo North E-Government Platform?',
      a: 'The official digital service portal designed for residents, businesses, and CDAs in Remo North Local Government Area, Ogun State. It enables citizens to apply for certificates, trade permits, report community infrastructural problems, and track applications online.'
    },
    {
      q: 'How do I track my submitted application?',
      a: 'Every submitted request receives a unique reference number (e.g. RMN-2026-00125). You can enter this code on our "Track Request" page anytime to see its real-time review progress, assigned department, and approval status.'
    },
    {
      q: 'What kind of community problems can I report?',
      a: 'You can report public infrastructure issues such as damaged roads and potholes, blocked drainage canals causing floods, broken or unlit streetlights, illegal refuse dumps, and damaged public boreholes.'
    },
    {
      q: 'Are certificates obtained through this platform officially recognized?',
      a: 'Yes. All certificates and permits issued through this portal—such as the Certificate of Local Government Origin and Business Premises Permits—bear digital verification codes authorized by Remo North Local Government Council.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-civic-900 via-slate-900 to-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle decorative civic pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-800/80 border border-civic-600/50 text-civic-300 text-xs font-semibold backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{settings?.hero_badge || 'Modernizing Public Service Delivery • Remo North LGA'}</span>
            </div>

            <div className="space-y-3">
              {settings?.logo_url && (
                <img
                  src={getFileUrl(settings.logo_url)}
                  alt={settings.site_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl object-contain bg-white p-2 shadow-2xl border border-white/10"
                />
              )}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {settings?.hero_title || 'Government Services, Made Easier for Everyone'}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {settings?.hero_subtitle || 'Access local government services, submit official requests, report community issues, and track your applications from one convenient, transparent digital platform.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/services"
                className="w-full sm:w-auto px-8 py-3.5 bg-civic-600 hover:bg-civic-500 text-white font-bold rounded-xl shadow-lg shadow-civic-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>{settings?.hero_cta_primary || 'Access Services'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/report"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{settings?.hero_cta_secondary || 'Report a Problem'}</span>
              </Link>
            </div>
          </div>

          {/* 2. QUICK SERVICE SEARCH */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-100">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="What service are you looking for? (e.g., Certificate of Origin, Business Permit...)"
                    className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-civic-800 hover:bg-civic-900 text-white font-semibold text-sm rounded-xl transition-colors shrink-0"
                >
                  Search Services
                </button>
              </form>

              {/* Popular tags */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Popular:</span>
                {['Certificates', 'Business Permit', 'CDA Registration', 'Sanitation', 'Road Repair'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => navigate(`/services?search=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-civic-50 hover:text-civic-800 text-slate-600 font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Municipal Offerings</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Government Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Transparent, rapid processing for individual citizens and corporate enterprises.
            </p>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold text-civic-800 hover:text-civic-900 flex items-center gap-1.5"
          >
            <span>View all services ({services.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-civic-100">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {service.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.expected_days} business days
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-civic-800 transition-colors line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {service.short_description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Processing Fee</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {service.fee_naira > 0 ? `₦${service.fee_naira.toLocaleString()}` : 'Free of Charge'}
                  </span>
                </div>
                <Link
                  to={`/services/${service.id}`}
                  className="px-4 py-2 text-xs font-bold text-civic-800 hover:text-white bg-civic-50 hover:bg-civic-800 rounded-lg transition-all"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (4 STEPS) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How The Platform Works
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Four straightforward steps from account creation to certificate issuance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Create an Account',
                desc: 'Register in less than a minute with your basic details and Remo North ward location.',
                icon: Users
              },
              {
                step: '02',
                title: 'Choose a Service',
                desc: 'Browse our catalog of local government certificates, business licenses, or permits.',
                icon: FileText
              },
              {
                step: '03',
                title: 'Submit Your Request',
                desc: 'Fill in the required information, attach documents, and receive your unique reference number.',
                icon: ShieldCheck
              },
              {
                step: '04',
                title: 'Track & Receive',
                desc: 'Monitor real-time progress as council officers review, approve, and issue your document.',
                icon: CheckCircle2
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group hover:bg-white hover:shadow-md transition-all">
                  <span className="text-3xl font-black text-slate-300 group-hover:text-civic-600 transition-colors block mb-4">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-civic-100 text-civic-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY REPORTING HIGHLIGHT */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-civic-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Civic Engagement & Infrastructure</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                Report a Problem in Your Community
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Spot a damaged road in Ode-Remo? Blocked drainage canal in Isara? Broken streetlight in Ipara or waste build-up in Akaka? Help council engineers deploy resources rapidly by reporting issues with photos and precise map locations.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {['Roads & Culverts', 'Waste & Sanitation', 'Street Lighting', 'Drainage', 'Water Supply'].map((c) => (
                  <span key={c} className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
                    &bull; {c}
                  </span>
                ))}
              </div>
              <div className="pt-3">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Report an Issue Now</span>
                </Link>
              </div>
            </div>

            {/* Visual Card Mockup */}
            <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Active Council Taskforce Dispatch</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Remo North GIS</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">Isara High School Junction Pothole</p>
                    <p className="text-[11px] text-slate-400">Assigned to: Works Department</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 font-bold">
                    In Progress
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">Akaka Town Hall Refuse Clean-up</p>
                    <p className="text-[11px] text-slate-400">Assigned to: Health Department</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-400/20 text-emerald-300 font-bold">
                    Resolved
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center italic">
                * Citizen reports are logged with geo-coordinates and reviewed daily by council officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST COUNCIL ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section className="py-16 bg-slate-100/70 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Official Bulletins</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Council Announcements
                </h2>
              </div>
              <Link
                to="/announcements"
                className="text-xs font-bold text-civic-800 hover:text-civic-900 flex items-center gap-1"
              >
                <span>All notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-civic-50 text-civic-800 font-semibold border border-civic-200">
                        {item.category}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {new Date(item.publish_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target: {item.target_audience}</span>
                    <Link
                      to="/announcements"
                      className="font-bold text-civic-800 hover:text-civic-900"
                    >
                      Read full &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. WHY USE THE PLATFORM */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Built for Citizens</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Why Use The E-Government Platform?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Queues, 24/7 Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No need to travel to the Isara-Remo council secretariat or wait in long physical lines. Apply, upload evidence, and pay from any computer or mobile device.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Authentic & Verifiable</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every document issued features a unique cryptographic verification reference that employers, universities, and federal institutions can authenticate instantly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Civic Accountability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete status transparency. Receive SMS and email updates when an officer reviews your case, and hold local governance accountable with transparent metrics.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Help Center</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-sm text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-civic-700' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="bg-civic-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to access Remo North Local Government services?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join hundreds of citizens already using the e-government management system to process certificates, trade permits, and community improvements.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-civic-900 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-lg"
            >
              Create Citizen Account
            </Link>
            <Link
              to="/track"
              className="px-6 py-3 border border-civic-600 text-white font-semibold rounded-xl text-xs sm:text-sm hover:bg-civic-800 transition-colors"
            >
              Track Existing Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
