import React from 'react';
import { Landmark, MapPin, Users, ShieldCheck, Award, Building2, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const wards = [
    { num: '01', name: 'Isara I', desc: 'Covering Ode-Lemo road corridor, Central Isara, and Palace environs.' },
    { num: '02', name: 'Isara II', desc: 'Covering High School road, market precinct, and Sabo quarters.' },
    { num: '03', name: 'Isara III', desc: 'Covering Afotamodi, agricultural settlements, and outskirts.' },
    { num: '04', name: 'Ode I', desc: 'Covering Ode central market, Palace axis, and traditional quarters.' },
    { num: '05', name: 'Ode II', desc: 'Covering Express road corridor, schools, and commercial layouts.' },
    { num: '06', name: 'Ipara', desc: 'Covering Old Toll Gate, commercial junction, and transit axis.' },
    { num: '07', name: 'Akaka', desc: 'Covering agrarian settlements, Town Hall square, and border areas.' },
    { num: '08', name: 'Ilara', desc: 'Covering health centre community, primary schools, and farming zones.' },
    { num: '09', name: 'Orile-Oko', desc: 'Covering agro-forestry reserves and rural community clusters.' },
    { num: '10', name: 'Arepo / Border', desc: 'Covering border development communities and emerging layouts.' },
  ];

  const leadershipRoles = [
    { title: 'Executive Chairman', role: 'Head of Council & Chief Executive', desc: 'Directs overall policy implementation and council governance.' },
    { title: 'Secretary to Local Government (SLG)', role: 'Head of Secretariat', desc: 'Oversees inter-departmental coordination and council records.' },
    { title: 'Head of Local Government Administration (HOLGA)', role: 'Head of Civil Service', desc: 'Manages career staff, civil service discipline, and operations.' },
    { title: 'Supervisory Councillors', role: 'Cabinet Members', desc: 'Supervises portfolios across Works, Health, Agriculture, and Community.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Council Profile & Case Study</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Remo North Local Government
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Headquartered in the historic town of Isara-Remo, Remo North Local Government is one of the foundational administrative councils in Ogun State, Nigeria.
          </p>
        </div>

        {/* Hero Image / Council Overview Card */}
        <div className="bg-gradient-to-br from-civic-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-800/80 text-civic-300 text-xs font-semibold border border-civic-600/40">
                <Landmark className="w-3.5 h-3.5 text-amber-300" />
                <span>Local Government Secretariat &bull; Isara-Remo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Modernizing Grassroots Governance in Ogun State
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Remo North Local Government was carved out to bring government closer to the people across our historic communities. Our mission is to combine administrative excellence, agricultural expansion, and modern digital technology to deliver rapid, corruption-free public services.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
                  <span className="text-xl font-black text-amber-300">10</span>
                  <span className="text-[11px] text-slate-300 block font-medium">Electoral Wards</span>
                </div>
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
                  <span className="text-xl font-black text-emerald-400">7</span>
                  <span className="text-[11px] text-slate-300 block font-medium">Active Departments</span>
                </div>
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
                  <span className="text-xl font-black text-blue-300">24/7</span>
                  <span className="text-[11px] text-slate-300 block font-medium">Digital Access</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-civic-400" />
                <span>Municipal Headquarters Address</span>
              </h3>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  <strong>Secretariat Complex:</strong> Palace Way, Isara-Remo, Ogun State, Nigeria.
                </p>
                <p>
                  <strong>Geographic Positioning:</strong> Coordinates: 6.99&deg;N, 3.68&deg;E, strategically connecting the Lagos-Ibadan expressway via Ipara and Ode-Remo corridor.
                </p>
                <p>
                  <strong>Major Communities:</strong> Isara-Remo, Ode-Remo, Ipara-Remo, Akaka-Remo, Ilara-Remo, and Orile-Oko.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Council Departments */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold text-civic-700 uppercase tracking-wider">Administrative Machinery</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Council Departments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Works & Infrastructure',
                desc: 'Maintains municipal roads, culverts, streetlights, and supervises public civil construction.'
              },
              {
                title: 'Primary Health Care & Environment',
                desc: 'Oversees primary health centres, routine immunization, refuse management, and public food hygiene.'
              },
              {
                title: 'General Administration & Legal',
                desc: 'Administers council records, certificate of origin verifications, and statutory council affairs.'
              },
              {
                title: 'Community Development & Social Welfare',
                desc: 'Partners with CDAs, youth associations, market committees, and vulnerable citizen welfare programs.'
              },
              {
                title: 'Agriculture & Rural Development',
                desc: 'Provides farm extension services, tractor hiring, fertilizer distribution, and agro-support.'
              },
              {
                title: 'Finance, Budget & Internal Revenue',
                desc: 'Manages council fiscal accounting, business premises assessments, and trade permit compliance.'
              }
            ].map((dept) => (
              <div key={dept.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{dept.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wards Directory */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold text-civic-700 uppercase tracking-wider">Geographic Structure</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The 10 Electoral Wards of Remo North
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {wards.map((w) => (
              <div key={w.num} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-1.5">
                <span className="text-xs font-mono font-bold text-civic-700 block">WARD {w.num}</span>
                <h4 className="text-sm font-bold text-slate-900">{w.name}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
