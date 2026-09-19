import React, { useState, useEffect } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, CategoryIcon, DemoDataBadge } from '../components/StatusBadge';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Navigation, 
  AlertTriangle,
  Radio,
  FileText,
  Shield
} from 'lucide-react';
import { IncidentStatus } from '../types';

export const ResponderDashboardView: React.FC<{ onSelectIncident: (id: string) => void }> = ({ onSelectIncident }) => {
  const { incidents, responders, updateIncidentStatus, updateResponderStatus } = useIncidents();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'assigned' | 'available_pool' | 'history'>('assigned');

  // Active responder context
  const currentResponder = responders.find(r => r.userId === currentUser?.uid) || responders[0];
  const [responderStatus, setResponderStatus] = useState<'Available' | 'Dispatched' | 'Off-duty'>(currentResponder?.status || 'Available');

  useEffect(() => {
    if (currentResponder?.status) {
      setResponderStatus(currentResponder.status);
    }
  }, [currentResponder?.status]);

  // Incidents assigned to this responder
  const assignedIncidents = incidents.filter(i => 
    i.assignedResponderId === currentResponder?.id || 
    (i.assignedResponderName && i.assignedResponderName.includes(currentResponder?.name || 'Marcus'))
  );

  const pendingOrActive = assignedIncidents.filter(i => i.status !== 'Resolved');
  const resolvedList = assignedIncidents.filter(i => i.status === 'Resolved');

  const handleStatusChange = async (incidentId: string, nextStatus: IncidentStatus, message: string) => {
    await updateIncidentStatus(
      incidentId,
      nextStatus,
      currentResponder ? `${currentResponder.name} (${currentResponder.type})` : 'Assigned Responder',
      'responder',
      message
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Responder Duty Status Header */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">{currentResponder.name}</h2>
              {currentResponder.isDemo && <DemoDataBadge label="Demo Unit Profile" />}
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 capitalize font-medium">
                {currentResponder.type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Duty Zone: {currentResponder.currentZone} • Radio: <span className="font-mono text-slate-300">{currentResponder.contactRadio}</span>
            </p>
          </div>
        </div>

        {/* Readiness Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">Readiness:</span>
          {(['Available', 'Dispatched', 'Off-duty'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setResponderStatus(st);
                if (currentResponder?.id) {
                  updateResponderStatus(currentResponder.id, st);
                }
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                responderStatus === st
                  ? st === 'Available'
                    ? 'bg-emerald-600 text-white'
                    : st === 'Dispatched'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'assigned'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          My Active Assignments ({pendingOrActive.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Completed Responded Calls ({resolvedList.length})
        </button>
      </div>

      {/* Active Assignments Content */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          {pendingOrActive.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-semibold text-slate-800 text-sm">No Active Tickets Dispatched</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no pending assignments right now. Stand by on {currentResponder.contactRadio} for dispatcher directives.
              </p>
            </div>
          ) : (
            pendingOrActive.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryIcon category={incident.category} className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold text-slate-800">{incident.id}</span>
                    {incident.isDemo && <DemoDataBadge label="Demo Incident" />}
                    <StatusBadge status={incident.status} />
                    <UrgencyBadge urgency={incident.urgency} isOverridden={incident.urgencyOverridden} />
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Assigned: {new Date(incident.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>{incident.locationName}</span>
                    <span className="text-xs text-slate-500 font-normal">({incident.zone})</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {incident.description}
                  </p>
                </div>

                {/* AI Triage Notes if available */}
                {incident.aiAnalysis && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-900">Triage Intelligence (Gemini Advisory):</span>
                      <span className="text-[10px] text-amber-700">Confidence: {Math.round(incident.aiAnalysis.confidence * 100)}%</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{incident.aiAnalysis.explanation}</p>
                    {incident.aiAnalysis.missingInformation.length > 0 && (
                      <div className="text-[11px] text-amber-950 font-medium pt-1">
                        Notice on scene: Look out for {incident.aiAnalysis.missingInformation.join(', ')}.
                      </div>
                    )}
                  </div>
                )}

                {/* Responder Actions Workflow */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectIncident(incident.id)}
                    className="text-xs text-indigo-700 hover:underline font-medium"
                  >
                    View Full Incident Timeline & Coordinates →
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Accept / Reject */}
                    {incident.status === 'Assigned' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(incident.id, 'Responding', 'Assignment accepted by field responder. En route.')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Accept & En Route
                        </button>
                        <button
                          onClick={() => handleStatusChange(incident.id, 'Under review', 'Responder declined assignment due to physical distance. Re-routing required.')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          Decline Assignment
                        </button>
                      </>
                    )}

                    {/* Responding -> Help arrived */}
                    {incident.status === 'Responding' && (
                      <button
                        onClick={() => handleStatusChange(incident.id, 'Help arrived', 'Responder has made physical contact on scene. Initiating first response.')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Beacon: "Help Arrived"
                      </button>
                    )}

                    {/* Help arrived -> Resolved */}
                    {(incident.status === 'Help arrived' || incident.status === 'Responding') && (
                      <button
                        onClick={() => handleStatusChange(incident.id, 'Resolved', 'Situation stabilized. Incident safely closed by responding personnel.')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Mark as Resolved
                      </button>
                    )}

                    {/* Escalation */}
                    {incident.status !== 'Escalated' && (
                      <button
                        onClick={() => handleStatusChange(incident.id, 'Escalated', 'Responder requested immediate outside municipal escalation (Call 911 dispatch).')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Escalate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History Content */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {resolvedList.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No closed calls in your personal response history.
            </div>
          ) : (
            resolvedList.map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{inc.id}</span>
                    <StatusBadge status={inc.status} size="sm" />
                    <span className="text-xs font-semibold text-slate-800">{inc.locationName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{inc.description}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  Resolved {new Date(inc.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
