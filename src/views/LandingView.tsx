import React from 'react';
import { UserRole } from '../types';
import { 
  ShieldAlert, 
  UserCheck, 
  LifeBuoy, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
  Radio,
  MapPin
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onOpenCheckin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenCheckin }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 px-4">
      {/* Hero Banner with Emergency Services Disclaimer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Campus, Venue & Community Safety Operations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            ResQRoute Emergency Coordination
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Privacy-first rapid response routing platform. Transforms reports into verified, prioritized, assigned, and trackable responses with AI triage assistance and human-in-the-loop oversight.
          </p>

          {/* Critical Disclaimer Banner */}
          <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200 leading-relaxed">
              <strong className="text-rose-100 font-bold block mb-0.5">CRITICAL SAFETY ADVISORY:</strong>
              ResQRoute is an internal coordination prototype and does <span className="underline font-semibold">NOT</span> replace official 911/112 emergency services, police, fire departments, municipal ambulances, or professional medical care. In life-threatening scenarios, call primary emergency hotlines immediately.
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="landing-report-incident-btn"
              onClick={() => onNavigate('report')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 font-semibold text-sm text-white shadow-lg transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              Report an Incident
            </button>

            <button
              id="landing-checkin-btn"
              onClick={onOpenCheckin}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-semibold text-sm text-white shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Anonymous "I'm Safe" Check-In
            </button>

            <button
              onClick={() => onNavigate('roles')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium text-sm text-slate-200 border border-slate-700 transition-all"
            >
              Role Selection & Demo Hub
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Role Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore Demo Experience by Role</h2>
            <p className="text-xs text-slate-500">Switch freely between the three authorized platform roles.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
            3 Interactive Roles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reporter Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Community Reporter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit an urgent issue with category, description, and approximate landmark. View privacy-protected real-time safe status updates.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Anonymous or registered reporting</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Safe status timeline tracker</li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex gap-2">
              <button
                onClick={() => onNavigate('report')}
                className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Submit Report
              </button>
              <button
                onClick={() => onNavigate('reporter_status')}
                className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Track Status
              </button>
            </div>
          </div>

          {/* Responder Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Field Responder</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-duty staff, certified first-aiders, and security personnel. Review assigned tickets, accept/reject, log arrival, and mark resolution.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accept or decline assignment</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Quick "Help arrived" beacon</li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => onNavigate('responder')}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Open Responder Dashboard
              </button>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Administrator Command</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Supervisory operations center. Inspect Gemini AI triage analysis, override priority, assign appropriate field units, and merge duplicate calls.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Human-in-the-loop AI triage</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Duplicate merging & dispatcher notes</li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => onNavigate('admin')}
                className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
              >
                Open Command Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Feature Grid */}
      <div className="bg-slate-50 rounded-xl p-6 sm:p-8 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">ResQRoute Privacy & Governance Architecture</h3>
        <p className="text-xs text-slate-600 mb-6 max-w-2xl">
          Built according to privacy-by-design principles to prevent vigilantism, panic spreading, and personal data leakage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-semibold text-slate-900">Zero Public PII</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Names, telephone records, and health conditions are strictly walled off from public eyes.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-semibold text-slate-900">Approximate Geofencing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Locations are generalized to zone landmarks to prevent stalking or personal tracking.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-slate-900">Advisory AI Triage</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gemini provides urgency suggestions with confidence metrics, never automated executive orders.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <Radio className="w-5 h-5 text-rose-600" />
            <h4 className="text-sm font-semibold text-slate-900">Role-Based RBAC</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Secured with Firebase Authentication and audited Firestore security rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
