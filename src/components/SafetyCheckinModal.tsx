import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { ShieldCheck, Check, Send, AlertTriangle } from 'lucide-react';
import { CAMPUS_ZONES } from '../lib/demoData';

export const SafetyCheckinModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { submitSafetyCheckin } = useIncidents();
  const [zone, setZone] = useState<string>(CAMPUS_ZONES[0]);
  const [status, setStatus] = useState<'safe' | 'need_assistance'>('safe');
  const [note, setNote] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitSafetyCheckin(zone, status, note);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setNote('');
    }, 1500);
  };

  return (
    <div id="safety-checkin-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Anonymous Safety Check-In</h3>
              <p className="text-xs text-slate-500">No name, phone, or personal tracking attached.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="font-semibold text-slate-900">Check-in Logged</h4>
            <p className="text-xs text-slate-500">
              Your anonymous status has been recorded in the community safety index.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Approximate Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                {CAMPUS_ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('safe')}
                  className={`p-3 rounded-lg border text-left text-sm font-medium flex items-center justify-between transition-all ${
                    status === 'safe'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>I am safe</span>
                  <ShieldCheck className={`w-4 h-4 ${status === 'safe' ? 'text-emerald-600' : 'text-slate-400'}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('need_assistance')}
                  className={`p-3 rounded-lg border text-left text-sm font-medium flex items-center justify-between transition-all ${
                    status === 'need_assistance'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>Need assistance</span>
                  <AlertTriangle className={`w-4 h-4 ${status === 'need_assistance' ? 'text-amber-600' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Optional Brief Note (Safe Context)
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g., Safe with 3 roommates in 3rd floor lounge"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Avoid personal phone numbers or names to preserve complete anonymity.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="submit-checkin-btn"
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Anonymous Check-In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
