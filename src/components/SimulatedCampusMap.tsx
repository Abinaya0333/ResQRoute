import React from 'react';
import { Incident } from '../types';
import { MapPin, AlertCircle, Shield, Building2, Flame, HeartPulse } from 'lucide-react';

interface CampusMapProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
  selectedIncidentId?: string;
}

export const SimulatedCampusMap: React.FC<CampusMapProps> = ({
  incidents,
  onSelectIncident,
  selectedIncidentId,
}) => {
  // Zones on the campus grid
  const campusZones = [
    { name: 'North Parking & Transit', x: 20, y: 15, w: 25, h: 20, icon: 'transit' },
    { name: 'Science & Engineering Quad', x: 15, y: 45, w: 30, h: 30, icon: 'science' },
    { name: 'Library Block', x: 50, y: 30, w: 25, h: 30, icon: 'library' },
    { name: 'Student Center & Dining', x: 50, y: 65, w: 25, h: 25, icon: 'center' },
    { name: 'South Residential Quad', x: 78, y: 55, w: 18, h: 35, icon: 'dorm' },
    { name: 'Athletics Complex', x: 78, y: 15, w: 18, h: 35, icon: 'sports' },
  ];

  return (
    <div id="simulated-campus-map-container" className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white relative overflow-hidden shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 className="font-semibold text-sm text-slate-200">Simulated Campus Operations Grid</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Privacy safeguard: Visual markers represent approximate zones only, not precise GPS pins.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Medical</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Security</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Fire / Hazard</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950/80 rounded-lg border border-slate-800/80 p-2 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>

        {/* Zones */}
        {campusZones.map((z, idx) => (
          <div
            key={idx}
            style={{
              left: `${z.x}%`,
              top: `${z.y}%`,
              width: `${z.w}%`,
              height: `${z.h}%`,
            }}
            className="absolute rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 flex flex-col justify-between hover:border-slate-700 transition-colors pointer-events-none"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{z.name}</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest self-end">
              Zone {idx + 1}
            </div>
          </div>
        ))}

        {/* Incident approximate markers */}
        {incidents
          .filter(inc => inc.status !== 'Resolved')
          .map((inc) => {
            const isSelected = inc.id === selectedIncidentId;
            const x = inc.mapCoordinates?.x || 50;
            const y = inc.mapCoordinates?.y || 50;

            let markerBg = 'bg-slate-500';
            let pulseRing = 'ring-slate-400';
            if (inc.category === 'medical') {
              markerBg = 'bg-rose-500';
              pulseRing = 'ring-rose-400';
            } else if (inc.category === 'security') {
              markerBg = 'bg-indigo-500';
              pulseRing = 'ring-indigo-400';
            } else if (inc.category === 'fire') {
              markerBg = 'bg-orange-500';
              pulseRing = 'ring-orange-400';
            } else if (inc.category === 'facility') {
              markerBg = 'bg-amber-500';
              pulseRing = 'ring-amber-400';
            }

            return (
              <button
                id={`incident-pin-${inc.id}`}
                key={inc.id}
                onClick={() => onSelectIncident?.(inc)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none transition-transform ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
                title={`${inc.category.toUpperCase()} - ${inc.locationName}`}
              >
                {/* Approximate zone halo */}
                <span className={`absolute -inset-2.5 rounded-full opacity-35 animate-ping ${markerBg}`}></span>
                <span className={`absolute -inset-1.5 rounded-full opacity-60 ${markerBg}`}></span>
                
                <div className={`relative flex items-center justify-center w-7 h-7 rounded-full text-white shadow-lg border-2 border-white ${markerBg}`}>
                  {inc.category === 'medical' ? (
                    <HeartPulse className="w-4 h-4" />
                  ) : inc.category === 'security' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>

                {/* Popover label */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-xl border border-slate-700 pointer-events-none z-30">
                  <p className="font-semibold truncate text-slate-100">{inc.locationName}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{inc.category} • Urgency: {inc.urgency}</p>
                  <p className="text-[10px] text-emerald-400 mt-1">Status: {inc.status}</p>
                </div>
              </button>
            );
          })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5">
        <span>Click any incident marker to focus dispatch actions</span>
        <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
          Total Active: {incidents.filter(i => i.status !== 'Resolved').length}
        </span>
      </div>
    </div>
  );
};
