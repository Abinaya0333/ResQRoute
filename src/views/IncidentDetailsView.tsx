import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, CategoryIcon, DemoDataBadge } from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Lock,
  GitMerge
} from 'lucide-react';

interface IncidentDetailsProps {
  incidentId: string;
  onBack: () => void;
}

export const IncidentDetailsView: React.FC<IncidentDetailsProps> = ({ incidentId, onBack }) => {
  const { getIncidentById, getUpdatesForIncident } = useIncidents();
  const { currentRole } = useAuth();

  const incident = getIncidentById(incidentId);
  const updates = getUpdatesForIncident(incidentId);

  if (!incident) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Incident Not Found</h3>
        <p className="text-xs text-slate-500">The requested incident record does not exist or has expired.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to incidents</span>
      </button>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryIcon category={incident.category} className="w-5 h-5" />
              <h2 className="text-xl font-bold text-slate-900">{incident.id}</h2>
              {incident.isDemo && <DemoDataBadge label="Demo Incident" size="sm" />}
              <StatusBadge status={incident.status} />
              <UrgencyBadge urgency={incident.urgency} isOverridden={incident.urgencyOverridden} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-semibold text-slate-800">{incident.locationName}</span>
              <span>• Zone: {incident.zone}</span>
            </div>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-500">
            <div>Submitted: {new Date(incident.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(incident.updatedAt).toLocaleString()}</div>
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Incident Description
          </h3>
          <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {incident.description}
          </p>
        </div>

        {/* Scene Image if exists */}
        {incident.imageUrl && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Scene Photo Reference
            </h3>
            <img
              src={incident.imageUrl}
              alt="Scene reference"
              className="w-full max-h-64 object-cover rounded-xl border border-slate-200"
            />
          </div>
        )}

        {/* AI Triage Intelligence Output */}
        {incident.aiAnalysis && (
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Gemini Incident Triage Intelligence</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                Confidence: {Math.round(incident.aiAnalysis.confidence * 100)}%
              </span>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed">
              {incident.aiAnalysis.explanation}
            </p>

            {incident.aiAnalysis.missingInformation.length > 0 && (
              <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong className="text-amber-900 block font-semibold">Flagged Missing Critical Information:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {incident.aiAnalysis.missingInformation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Disclaimer label */}
            <div className="text-[11px] text-amber-900/90 bg-amber-100/70 p-2 rounded border border-amber-200">
              ⚠️ <strong>Mandatory AI Disclaimer:</strong> {incident.aiAnalysis.disclaimer}
            </div>
          </div>
        )}

        {/* Linked Duplicates if merged */}
        {incident.mergedChildIds && incident.mergedChildIds.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <GitMerge className="w-4 h-4 text-indigo-600" />
              <span>Consolidated Duplicate Reports:</span>
            </div>
            <p className="text-slate-600">
              The following reports were merged into this primary ticket by dispatcher triage: {incident.mergedChildIds.join(', ')}.
            </p>
          </div>
        )}

        {/* Assignment info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-medium">Assigned Responder:</span>
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>{incident.assignedResponderName || 'Awaiting assignment by dispatcher'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-medium">Reporter Identity Protection:</span>
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>
                {incident.reporterAnonymous ? 'Anonymous (Zero PII logged)' : (currentRole === 'admin' ? incident.reporterName : 'Protected User')}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Official Incident Audit Trail & Milestones</span>
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {updates.length === 0 ? (
              <p className="text-xs text-slate-500">No status logs recorded yet.</p>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="relative space-y-1">
                  {/* Timeline dot */}
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white"></span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {update.actorName} ({update.actorRole})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Status &rarr; {update.statusTo}:</span> {update.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
