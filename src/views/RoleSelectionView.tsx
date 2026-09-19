import React from 'react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../lib/demoData';
import { UserCheck, Shield, Award, Check } from 'lucide-react';
import { DemoDataBadge } from '../components/StatusBadge';

export const RoleSelectionView: React.FC<{ onRoleSelected: (role: UserRole) => void }> = ({ onRoleSelected }) => {
  const { currentRole, switchDemoUser } = useAuth();

  const handleSelect = (role: UserRole) => {
    switchDemoUser(role);
    onRoleSelected(role);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <DemoDataBadge label="Seeded Demo Roles" size="sm" />
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full">
            Live Interactive Switcher
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Select Demo Account Role</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          ResQRoute uses strict Firebase Role-Based Access Control (RBAC). Switching roles loads the specific permissions, data access filters, and action tools for that actor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reporter */}
        <div
          onClick={() => handleSelect('reporter')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all flex flex-col justify-between ${
            currentRole === 'reporter'
              ? 'border-rose-600 bg-rose-50/40 shadow-md ring-1 ring-rose-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                RP
              </span>
              <div className="flex items-center gap-1.5">
                <DemoDataBadge label="Demo User" />
                {currentRole === 'reporter' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">Reporter Role</h3>
            <p className="text-xs text-slate-600">
              {DEMO_USERS.reporter.displayName}
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <p>• Submit incident reports</p>
              <p>• Upload optional photo / context</p>
              <p>• Track personal ticket updates</p>
              <p>• Submit anonymous check-in</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('reporter');
            }}
            className={`mt-6 w-full py-2 px-3 text-xs font-semibold rounded-lg text-white ${
              currentRole === 'reporter' ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {currentRole === 'reporter' ? 'Currently Operating' : 'Switch to Reporter'}
          </button>
        </div>

        {/* Responder */}
        <div
          onClick={() => handleSelect('responder')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all flex flex-col justify-between ${
            currentRole === 'responder'
              ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-1 ring-indigo-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                FD
              </span>
              <div className="flex items-center gap-1.5">
                <DemoDataBadge label="Demo Unit" />
                {currentRole === 'responder' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">Responder Role</h3>
            <p className="text-xs text-slate-600">
              {DEMO_USERS.responder.displayName}
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <p>• View assigned dispatch orders</p>
              <p>• Accept or decline assignments</p>
              <p>• Beacon: "Help arrived"</p>
              <p>• Mark resolution & triage notes</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('responder');
            }}
            className={`mt-6 w-full py-2 px-3 text-xs font-semibold rounded-lg text-white ${
              currentRole === 'responder' ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {currentRole === 'responder' ? 'Currently Operating' : 'Switch to Responder'}
          </button>
        </div>

        {/* Administrator */}
        <div
          onClick={() => handleSelect('admin')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all flex flex-col justify-between ${
            currentRole === 'admin'
              ? 'border-amber-600 bg-amber-50/40 shadow-md ring-1 ring-amber-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                AD
              </span>
              <div className="flex items-center gap-1.5">
                <DemoDataBadge label="Demo Admin" />
                {currentRole === 'admin' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">Administrator Command</h3>
            <p className="text-xs text-slate-600">
              {DEMO_USERS.admin.displayName}
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <p>• Inspect Gemini AI triage suggestions</p>
              <p>• Verify reports & override urgency</p>
              <p>• Dispatch available responders</p>
              <p>• Merge duplicate incident reports</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('admin');
            }}
            className={`mt-6 w-full py-2 px-3 text-xs font-semibold rounded-lg text-white ${
              currentRole === 'admin' ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {currentRole === 'admin' ? 'Currently Operating' : 'Switch to Administrator'}
          </button>
        </div>
      </div>
    </div>
  );
};
