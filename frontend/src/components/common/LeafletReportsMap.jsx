import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar, Tag, AlertTriangle } from 'lucide-react';

const categoryColors = {
  'Roads & Transport': '#ea580c',
  'Waste & Sanitation': '#16a34a',
  'Street Lighting': '#d97706',
  'Drainage & Flood': '#2563eb',
  'Water Supply': '#0891b2',
  'Public Facilities': '#9333ea',
  'Other': '#64748b'
};

const createCategoryIcon = (category) => {
  const color = categoryColors[category] || '#15803d';
  return L.divIcon({
    className: 'custom-cat-marker',
    html: `
      <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.35);">
        <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const LeafletReportsMap = ({ reports = [], height = '500px', onSelectReport }) => {
  // Center of Remo North LGA (Isara)
  const defaultCenter = [7.0012, 3.6821];

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      {/* Legend bar */}
      <div className="bg-white/95 backdrop-blur px-4 py-2.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <MapPin className="w-4 h-4 text-civic-700" />
          <span>Remo North Problem Heatmap & Locations:</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height }} className="w-full">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((report) => {
            if (!report.latitude || !report.longitude) return null;

            return (
              <Marker
                key={report.id || report.reference_code}
                position={[report.latitude, report.longitude]}
                icon={createCategoryIcon(report.category)}
              >
                <Popup className="custom-popup">
                  <div className="p-1 space-y-2 max-w-[260px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-civic-800 bg-civic-50 px-1.5 py-0.5 rounded border border-civic-200">
                        {report.reference_code}
                      </span>
                      <StatusBadge status={report.status} size="sm" />
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">
                      {report.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {report.description}
                    </p>

                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{report.location_name} ({report.community_area})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </div>

                    {report.image_url && (
                      <div className="mt-1 rounded overflow-hidden max-h-24">
                        <img src={report.image_url} alt={report.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {onSelectReport && (
                      <button
                        onClick={() => onSelectReport(report)}
                        className="w-full mt-2 py-1 text-center bg-civic-800 text-white rounded text-xs font-semibold hover:bg-civic-900 transition-colors"
                      >
                        Inspect Report
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletReportsMap;
