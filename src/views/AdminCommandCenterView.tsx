import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, CategoryIcon, DemoDataBadge } from '../components/StatusBadge';
import { SimulatedCampusMap } from '../components/SimulatedCampusMap';
import { Incident, IncidentStatus, IncidentUrgency, IncidentCategory } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  UserCheck, 
  GitMerge, 
  RefreshCw, 
  Check, 
  Filter, 
  ChevronRight,
  MapPin,
  ExternalLink,
  Layers,
  Database,
  Lock,
  Eye,
  Info
} from 'lucide-react';

export const AdminCommandCenterView: React.FC<{
  onSelectIncident: (id: string) => void;
  onOpenCheckin: () => void;
}> = ({ onSelectIncident, onOpenCheckin }) => {
  const { 
    incidents, 
    responders, 
    safetyCheckins, 
    overrideUrgency, 
    assignResponder, 
    updateIncidentStatus, 
    mergeDuplicates,
    resetToDemoData 
  } = useIncidents();
  const { currentUser } = useAuth();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Merge modal state
  const [mergeModalOpen, setMergeModalOpen] = useState<boolean>(false);
  const [targetMergeId, setTargetMergeId] = useState<string>('');

  // Selected incident object
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (categoryFilter !== 'all' && inc.category !== categoryFilter) return false;
    if (urgencyFilter !== 'all' && inc.urgency !== urgencyFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchLoc = inc.locationName.toLowerCase().includes(q);
      const matchDesc = inc.description.toLowerCase().includes(q);
      const matchId = inc.id.toLowerCase().includes(q);
      return matchLoc || matchDesc || matchId;
    }
    return true;
  });

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const criticalCount = incidents.filter(i => i.urgency === 'Critical' || i.urgency === 'High').length;

  const handleOverridePriority = async (newUrgency: IncidentUrgency) => {
    if (!selectedIncident) return;
    await overrideUrgency(selectedIncident.id, newUrgency, `Manual administrative priority adjustment.`);
  };

  const handleVerify = async () => {
    if (!selectedIncident) return;
    await updateIncidentStatus(
      selectedIncident.id,
      'Verified',
      currentUser?.displayName || 'Administrator Command',
      'admin',
      'Report officially reviewed and verified by on-duty administrator.'
    );
  };

  const handleAssign = async (responderId: string) => {
    if (!selectedIncident || !responderId) return;
    await assignResponder(selectedIncident.id, responderId, currentUser?.displayName || 'Administrator Command');
  };

  const handleMergeSubmit = async () => {
    if (!selectedIncident || !targetMergeId) return;
    await mergeDuplicates(selectedIncident.id, targetMergeId, currentUser?.displayName || 'Administrator Command');
    setMergeModalOpen(false);
    setTargetMergeId('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Operations Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-bold text-slate-900">Administrator Command Center</h2>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              Live Dispatch Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time incident verification, AI triage auditing, priority override, and unit dispatch.
          </p>
        </div>

        {/* Action badges & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
            <DemoDataBadge label="Demo Metrics" size="xs" />
            <span className="font-semibold text-rose-600">{criticalCount}</span> High/Critical
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-800">{activeIncidents.length}</span> Active
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-emerald-600">{safetyCheckins.length}</span> Safe Check-ins
          </div>

          <button
            onClick={() => {
              resetToDemoData();
              setSelectedIncidentId('INC-2026-0881');
            }}
            title="Restore the seeded Library Block training incident and demo metrics without removing user reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Scenario</span>
          </button>
        </div>
      </div>

      {/* Simulated Operations Grid (Campus Map) */}
      <SimulatedCampusMap
        incidents={incidents}
        selectedIncidentId={selectedIncident?.id}
        onSelectIncident={(inc) => setSelectedIncidentId(inc.id)}
      />

      {/* Main Console Split: Master List vs Active Focus Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incidents Triage Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filters */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Filter by location, ID, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] text-xs border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-800"
                >
                  <option value="all">All Urgency</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-800"
                >
                  <option value="all">All Categories</option>
                  <option value="medical">Medical</option>
                  <option value="security">Security</option>
                  <option value="fire">Fire</option>
                  <option value="facility">Facility</option>
                </select>
              </div>
            </div>
          </div>

          {/* Queue Cards */}
          <div className="space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No incidents match the active filters.
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = incident.id === selectedIncident?.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/10'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CategoryIcon category={incident.category} className="w-4 h-4" />
                        <span className="font-mono text-xs font-bold text-slate-900">{incident.id}</span>
                        {incident.isDemo && <DemoDataBadge label="Demo Incident" size="xs" />}
                        <StatusBadge status={incident.status} size="sm" />
                        <UrgencyBadge urgency={incident.urgency} isOverridden={incident.urgencyOverridden} />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="py-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{incident.locationName}</span>
                        <span className="text-[11px] text-slate-500 font-normal">({incident.zone})</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {incident.description}
                      </p>
                    </div>

                    {/* AI Advisory Summary Pill */}
                    {incident.aiAnalysis && (
                      <div className="mt-1 flex items-center justify-between bg-amber-50/60 px-2.5 py-1.5 rounded-lg text-[11px] border border-amber-200 text-amber-900">
                        <div className="flex items-center gap-1.5 truncate">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">AI: {incident.aiAnalysis.explanation}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-amber-800 shrink-0 ml-2">
                          {Math.round(incident.aiAnalysis.confidence * 100)}% conf
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>
                        Assigned:{' '}
                        <strong className="text-slate-700">
                          {incident.assignedResponderName || 'Unassigned'}
                        </strong>
                      </span>
                      <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                        Focus Controls <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Admin Incident Control Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedIncident ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5 sticky top-4">
              {/* Header */}
              <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{selectedIncident.id}</span>
                    <StatusBadge status={selectedIncident.status} size="sm" />
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>{selectedIncident.locationName}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectIncident(selectedIncident.id)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* AI Triage Recommendation Box */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Gemini Triage Intelligence</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                    Confidence: {selectedIncident.aiAnalysis ? Math.round(selectedIncident.aiAnalysis.confidence * 100) : 88}%
                  </span>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed">
                  {selectedIncident.aiAnalysis?.explanation || 'Automatic algorithmic evaluation based on keywords.'}
                </div>

                {selectedIncident.aiAnalysis?.missingInformation && selectedIncident.aiAnalysis.missingInformation.length > 0 && (
                  <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
                    <strong className="block text-amber-900">Detected Missing Information:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {selectedIncident.aiAnalysis.missingInformation.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mandatory Disclaimer Label */}
                <div className="text-[10px] text-amber-900/90 font-medium bg-amber-100/70 p-2 rounded border border-amber-200">
                  ⚠️ <strong>AI Advisory Notice:</strong> Gemini output is an algorithmic recommendation, not a diagnosis or emergency dispatch decision.
                </div>
              </div>

              {/* Urgency Override Controls */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dispatcher Priority Override
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as const).map((urg) => (
                    <button
                      key={urg}
                      onClick={() => handleOverridePriority(urg)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedIncident.urgency === urg
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
                {selectedIncident.urgencyOverridden && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    Original AI Urgency was <strong>{selectedIncident.originalAiUrgency}</strong> (Overridden by Admin).
                  </p>
                )}
              </div>

              {/* Status Verification Action */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Incident Verification State
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleVerify}
                    disabled={selectedIncident.status === 'Verified' || selectedIncident.status === 'Resolved'}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    {selectedIncident.status === 'Verified' ? '✓ Verified' : 'Verify Incident Report'}
                  </button>
                  <button
                    onClick={() => setMergeModalOpen(true)}
                    className="py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg inline-flex items-center gap-1"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>Merge Duplicates</span>
                  </button>
                </div>
              </div>

              {/* Responder Assignment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assign Campus Responder Unit
                </label>
                <select
                  value={selectedIncident.assignedResponderId || ''}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="">Select available personnel...</option>
                  {responders.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.type.toUpperCase()}) — [{r.status}] {r.currentZone}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Assigning sends an instant dispatch notification to the responder dashboard.
                </p>
              </div>

              {/* Admin-Only Sensitive Details (Protected by Security Rules) */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    Admin-Only Sensitive Details
                  </label>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                    RBAC Protected
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reporter Identity:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedIncident.reporterAnonymous 
                        ? `Anonymous Report (${selectedIncident.reporterName || 'Protected User'})` 
                        : (selectedIncident.reporterName || 'Registered Campus User')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reporter ID:</span>
                    <span className="font-mono text-[11px] text-slate-700">{selectedIncident.reporterId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Raw Geolocation:</span>
                    <span className="font-mono text-[11px] text-slate-700">
                      Grid ({selectedIncident.mapCoordinates?.x ?? 50}%, {selectedIncident.mapCoordinates?.y ?? 50}%)
                    </span>
                  </div>
                  {selectedIncident.duplicateOf && (
                    <div className="flex justify-between text-indigo-700 font-medium">
                      <span>Merged Duplicate:</span>
                      <span className="font-mono">{selectedIncident.duplicateOf}</span>
                    </div>
                  )}
                  {selectedIncident.isDemo && (
                    <div className="pt-1 flex items-center justify-between border-t border-slate-200">
                      <span className="text-slate-500">Data Origin:</span>
                      <DemoDataBadge label="Seeded Training Scenario" size="xs" />
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Scene Image if present */}
              {selectedIncident.imageUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Submitted Scene Photo
                  </label>
                  <img
                    src={selectedIncident.imageUrl}
                    alt="Scene report"
                    className="w-full h-36 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Select an incident from the queue to view details and controls.
            </div>
          )}
        </div>
      </div>

      {/* Duplicate Merge Modal */}
      {mergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <GitMerge className="w-4 h-4 text-indigo-600" />
                Merge Duplicate Incident
              </h3>
              <button onClick={() => setMergeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Link another report as a duplicate of <strong>{selectedIncident.id}</strong> ({selectedIncident.locationName}). The linked ticket will be closed and consolidated into this primary master incident.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Secondary Duplicate Ticket:
              </label>
              <select
                value={targetMergeId}
                onChange={(e) => setTargetMergeId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="">Choose ticket to merge...</option>
                {incidents
                  .filter((i) => i.id !== selectedIncident.id && i.status !== 'Resolved')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.id} — {i.locationName} ({i.category})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMergeModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeSubmit}
                disabled={!targetMergeId}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg"
              >
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
