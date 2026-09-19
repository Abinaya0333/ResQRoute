import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, CategoryIcon, DemoDataBadge } from '../components/StatusBadge';
import { ShieldAlert, Clock, ArrowLeft, RefreshCw, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { Incident } from '../types';

interface ReporterStatusProps {
  onSelectIncident: (id: string) => void;
  onNewReport: () => void;
  highlightedIncidentId?: string;
}

export const ReporterStatusView: React.FC<ReporterStatusProps> = ({
  onSelectIncident,
  onNewReport,
  highlightedIncidentId,
}) => {
  const { incidents, getUpdatesForIncident } = useIncidents();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  // Filter incidents reported by current user or show recent demo reports if empty
  const userIncidents = incidents.filter(i => {
    if (currentUser?.role === 'reporter') {
      return i.reporterId === currentUser.uid || i.isDemo;
    }
    return true;
  });

  const filteredIncidents = userIncidents.filter(inc => {
    if (filter === 'active') return inc.status !== 'Resolved';
    if (filter === 'resolved') return inc.status === 'Resolved';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-bold text-slate-900">Reporter Incident Status Tracker</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Safe, real-time response milestones without displaying personal identities or tactical responder coordinates.
          </p>
        </div>
        <button
          onClick={onNewReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <ShieldAlert className="w-4 h-4" />
          Report Another Issue
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
          {(['all', 'active', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                filter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab} ({userIncidents.filter(i => tab === 'all' ? true : tab === 'active' ? i.status !== 'Resolved' : i.status === 'Resolved').length})
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Showing {filteredIncidents.length} incidents
        </span>
      </div>

      {/* List */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-sm">No Incidents Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no recorded incident reports under this filter.
          </p>
          <button
            onClick={onNewReport}
            className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg"
          >
            Create your first report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const updates = getUpdatesForIncident(incident.id);
            const latestUpdate = updates[0];
            const isHighlighted = incident.id === highlightedIncidentId;

            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident.id)}
                className={`bg-white rounded-xl border p-5 shadow-xs hover:border-slate-400 transition-all cursor-pointer ${
                  isHighlighted ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryIcon category={incident.category} className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold text-slate-700">{incident.id}</span>
                    {incident.isDemo && <DemoDataBadge label="Demo Incident" size="xs" />}
                    <StatusBadge status={incident.status} size="sm" />
                    <UrgencyBadge urgency={incident.urgency} isOverridden={incident.urgencyOverridden} />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Logged: {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="py-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{incident.locationName}</span>
                    <span className="text-[11px] text-slate-500 font-normal">({incident.zone})</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {incident.description}
                  </p>
                </div>

                {/* Safe Milestone Status */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Latest Milestone:</strong> {latestUpdate ? latestUpdate.message : `Current operational status is ${incident.status}.`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium self-end sm:self-center">
                    <span>View Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
