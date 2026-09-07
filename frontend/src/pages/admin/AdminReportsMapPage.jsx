import React, { useState, useEffect } from 'react';
import { reportsService } from '../../services/api';
import LeafletReportsMap from '../../components/common/LeafletReportsMap';
import { MapPin, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReportsMapPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = ['All', 'Roads & Transport', 'Waste & Sanitation', 'Street Lighting', 'Drainage & Flood', 'Water Supply', 'Public Facilities', 'Other'];
  const statuses = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportsService.getReports({ per_page: 100 });
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchStat = selectedStatus === 'All' || r.status === selectedStatus;
    return matchCat && matchStat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">Geospatial Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Remo North Community Issues Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive GIS dashboard visualizing citizen problem reports across Isara, Ode, Ipara, Akaka, and Ilara.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            {filteredReports.length} Pinpoints Plotted
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Category:</span>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-civic-800 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
          >
            {statuses.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      {/* Map Display */}
      {loading ? (
        <LoadingSpinner message="Rendering geospatial map data..." />
      ) : (
        <div className="space-y-4">
          <LeafletReportsMap
            reports={filteredReports}
            height="560px"
          />

          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
            <span>
              * Click on any colored pin on the map to inspect report details, citizen photos, and resolution updates.
            </span>
            <span className="font-semibold text-civic-800">
              Coverage: Remo North LGA (Isara, Ode, Ipara, Akaka, Ilara, Orile-Oko)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsMapPage;
