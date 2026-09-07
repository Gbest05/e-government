import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiries',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Civic Helpdesk & Liaison</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Remo North Local Council
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Have questions about local government services, verification slips, or council policies? Reach out to our customer care officers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center shrink-0 border border-civic-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Secretariat Office</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Remo North Local Government Secretariat Complex, Palace Way, Isara-Remo, Ogun State, Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center shrink-0 border border-civic-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Helplines</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Main Desk: +234 (0) 803 111 2233<br />
                    Emergency Toll: 0800-REMO-HELP
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center shrink-0 border border-civic-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Email Desks</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    General: info@remonorth.og.gov.ng<br />
                    Registry: certificates@remonorth.og.gov.ng
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center shrink-0 border border-civic-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Official Operating Hours</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Monday &ndash; Friday: 8:00 AM &ndash; 4:00 PM<br />
                    Closed on Weekends and Public Holidays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out to Remo North Local Government. A council officer will review your inquiry and respond within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', department: 'General Inquiries', message: '' });
                    }}
                    className="px-6 py-2.5 bg-civic-800 text-white rounded-xl text-xs font-bold hover:bg-civic-900"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Send an Inquiry or Feedback</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. 08031234567"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Department</label>
                      <select
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
                      >
                        <option value="General Inquiries">General Secretariat Inquiries</option>
                        <option value="Works & Infrastructure">Works and Infrastructure</option>
                        <option value="Health & Environment">Health and Environmental Sanitation</option>
                        <option value="Certificates Registry">Certificates & Registry</option>
                        <option value="Finance & Revenue">Finance and Internal Revenue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your inquiry or feedback clearly..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
