import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Custom SVG icon for pinpointing issues
const createCustomPin = (color = '#15803d') => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position} icon={createCustomPin('#dc2626')} />
  ) : null;
};

// Preset Remo North town coordinates
const REMO_NORTH_TOWNS = [
  { name: 'Isara-Remo (HQ)', coords: [7.0012, 3.6821] },
  { name: 'Ode-Remo', coords: [6.9845, 3.7120] },
  { name: 'Ipara-Remo', coords: [6.9531, 3.6615] },
  { name: 'Akaka-Remo', coords: [7.0345, 3.7310] },
  { name: 'Ilara-Remo', coords: [7.0125, 3.6940] },
];

const LeafletMapPicker = ({ latitude, longitude, onChange, height = '320px' }) => {
  const [position, setPosition] = useState(
    latitude && longitude ? [latitude, longitude] : [7.0012, 3.6821]
  );

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handlePositionChange = (coords) => {
    setPosition(coords);
    if (onChange) {
      onChange(coords[0], coords[1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
        <span className="flex items-center gap-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-civic-700" />
          Click on the map to pin exact problem location in Remo North:
        </span>
        {position && (
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
          </span>
        )}
      </div>

      {/* Preset town shortcut buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 font-medium">Quick Town:</span>
        {REMO_NORTH_TOWNS.map((town) => (
          <button
            key={town.name}
            type="button"
            onClick={() => handlePositionChange(town.coords)}
            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-civic-100 hover:text-civic-800 text-slate-700 rounded border border-slate-200 transition-colors"
          >
            {town.name}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner relative">
        <MapContainer
          center={position || [7.0012, 3.6821]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
      </div>
      <p className="text-[11px] text-slate-400">
        * Tip: Approximate locations are adequate. Avoid pinpointing private interior rooms.
      </p>
    </div>
  );
};

export default LeafletMapPicker;
