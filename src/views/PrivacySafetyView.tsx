import React from 'react';
import { ShieldAlert, Lock, EyeOff, MapPin, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacySafetyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-700">
          <Lock className="w-5 h-5" />
          <h2 className="text-2xl font-bold text-slate-900">Privacy Architecture & Safety Governance</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          ResQRoute is designed from the ground up to protect community members, prevent panic escalation, and ensure ethical AI assistance during urgent situations.
        </p>
      </div>

      {/* Emergency Non-Replacement Disclaimer */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-5 space-y-2 text-rose-950">
        <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Notice Regarding Emergency Response Services (911 / 112)</span>
        </div>
        <p className="text-xs leading-relaxed text-rose-900">
          ResQRoute is an internal situational coordination software prototype intended for campus resident life, facility teams, venue event marshals, and neighborhood safety committees. <strong>It does not replace municipal 911 dispatch, official police, fire brigades, paramedic EMS, or hospital emergency medicine.</strong> In an active life-threatening crisis, call primary municipal emergency telephone lines immediately.
        </p>
      </div>

      {/* 4 Pillars of Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">1. Zero Public PII Exposure</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Public status views and fellow community members can never inspect the reporter's full legal name, phone number, dorm room number, or confidential health conditions. Reports support full anonymity.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">2. Zone-Level Approximate Geofencing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rather than transmitting continuous device GPS telemetry or pinpointing individual persons, incidents are bound to generalized zone landmarks (e.g. "Library Block", "South Residential Quad") to prevent digital stalking.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">3. Advisory AI Triage Standards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gemini AI model outputs are strictly categorized as <em>advisory suggestions</em>. AI outputs never auto-dispatch weapons or take autonomous disciplinary measures. Human dispatchers maintain full override control.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">4. Audited RBAC & Firestore Rules</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Firebase Authentication combined with declarative Firestore security rules ensures reporters only access their own submissions, responders only see assigned dispatch tickets, and admins manage overall flow.
          </p>
        </div>
      </div>

      {/* Data Model & Retention Summary */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Data Model & Retention Specifications</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The ResQRoute schema partitions operational activity across 6 isolated collections:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">users</strong>
            <span className="text-[11px] text-slate-500">Profiles with validated role authorization.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">incidents</strong>
            <span className="text-[11px] text-slate-500">Core tickets with status, category & zone.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">responders</strong>
            <span className="text-[11px] text-slate-500">Registered first-aid, security & venue staff.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">incident_assignments</strong>
            <span className="text-[11px] text-slate-500">Dispatch matchings & responder confirmations.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">incident_updates</strong>
            <span className="text-[11px] text-slate-500">Immutable chronological milestone audits.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">safety_checkins</strong>
            <span className="text-[11px] text-slate-500">Anonymous safety confirmations by zone.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
