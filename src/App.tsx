import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useIncidents } from './context/IncidentContext';
import { LandingView } from './views/LandingView';
import { RoleSelectionView } from './views/RoleSelectionView';
import { IncidentFormView } from './views/IncidentFormView';
import { ReporterStatusView } from './views/ReporterStatusView';
import { ResponderDashboardView } from './views/ResponderDashboardView';
import { AdminCommandCenterView } from './views/AdminCommandCenterView';
import { IncidentDetailsView } from './views/IncidentDetailsView';
import { PrivacySafetyView } from './views/PrivacySafetyView';
import { SafetyCheckinModal } from './components/SafetyCheckinModal';
import { 
  ShieldAlert, 
  Radio, 
  Users, 
  Lock, 
  Menu, 
  X, 
  CheckCircle2, 
  FileText, 
  HelpCircle,
  Home,
  Shield,
  Activity
} from 'lucide-react';

export default function App() {
  const { currentRole, currentUser, switchDemoUser } = useAuth();
  const { isSyncing } = useIncidents();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setCurrentView('details');
  };

  const handleSubmitted = (newIncidentId: string) => {
    setSelectedIncidentId(newIncidentId);
    setCurrentView('reporter_status');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Demo Context Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80 font-bold uppercase tracking-wider text-[10px]">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Internal Prototype
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-tight px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Simulated Demo Data
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Response metrics and scenarios are simulated demonstrations; not real-world benchmarks.
          </span>
          {isSyncing && (
            <span className="text-[10px] text-amber-400 animate-pulse flex items-center gap-1">
              <Activity className="w-3 h-3" /> Cloud Synced
            </span>
          )}
        </div>

        {/* Interactive Quick Role Badge */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Operating Role:</span>
          <div className="flex bg-slate-900 rounded border border-slate-700 p-0.5 text-[11px] font-semibold">
            <button
              onClick={() => {
                switchDemoUser('reporter');
                if (currentView === 'responder' || currentView === 'admin') setCurrentView('reporter_status');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                currentRole === 'reporter' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reporter
            </button>
            <button
              onClick={() => {
                switchDemoUser('responder');
                setCurrentView('responder');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                currentRole === 'responder' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Responder
            </button>
            <button
              onClick={() => {
                switchDemoUser('admin');
                setCurrentView('admin');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                currentRole === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <div 
            onClick={() => handleNavigate('landing')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                ResQ<span className="text-rose-600">Route</span>
              </span>
              <span className="text-[10px] block font-semibold text-slate-500 uppercase tracking-wider -mt-1">
                Campus & Venue Safety
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              id="nav-landing-btn"
              onClick={() => handleNavigate('landing')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'landing' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Overview
            </button>

            <button
              id="nav-report-btn"
              onClick={() => handleNavigate('report')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'report' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Report Incident
            </button>

            <button
              id="nav-status-btn"
              onClick={() => handleNavigate('reporter_status')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'reporter_status' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Reporter Tracker
            </button>

            <button
              id="nav-responder-btn"
              onClick={() => {
                switchDemoUser('responder');
                handleNavigate('responder');
              }}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'responder' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Radio className="w-4 h-4 text-indigo-600" />
              Responder Ops
            </button>

            <button
              id="nav-admin-btn"
              onClick={() => {
                switchDemoUser('admin');
                handleNavigate('admin');
              }}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'admin' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-600" />
              Command Center
            </button>

            <button
              id="nav-privacy-btn"
              onClick={() => handleNavigate('privacy')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'privacy' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              Privacy & Safeguards
            </button>
          </nav>

          {/* Header Action CTA: Anonymous Checkin Button */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              id="header-checkin-btn"
              onClick={() => setIsCheckinOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>"I'm Safe" Check-In</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 text-sm font-medium">
            <button
              onClick={() => handleNavigate('landing')}
              className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Overview
            </button>
            <button
              onClick={() => handleNavigate('report')}
              className="w-full text-left py-2 px-3 rounded-lg text-rose-700 font-semibold hover:bg-rose-50"
            >
              Report Incident
            </button>
            <button
              onClick={() => handleNavigate('reporter_status')}
              className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Reporter Status Tracker
            </button>
            <button
              onClick={() => {
                switchDemoUser('responder');
                handleNavigate('responder');
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-indigo-700 hover:bg-indigo-50"
            >
              Responder Dashboard
            </button>
            <button
              onClick={() => {
                switchDemoUser('admin');
                handleNavigate('admin');
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-amber-800 hover:bg-amber-50"
            >
              Administrator Command Center
            </button>
            <button
              onClick={() => handleNavigate('roles')}
              className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Switch Role & Demo Profiles
            </button>
            <button
              onClick={() => handleNavigate('privacy')}
              className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Privacy & Safeguards
            </button>
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCheckinOpen(true);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-center font-semibold"
              >
                Anonymous "I'm Safe" Check-In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView 
            onNavigate={handleNavigate} 
            onOpenCheckin={() => setIsCheckinOpen(true)} 
          />
        )}

        {currentView === 'roles' && (
          <RoleSelectionView 
            onRoleSelected={(role) => {
              if (role === 'reporter') handleNavigate('report');
              else if (role === 'responder') handleNavigate('responder');
              else if (role === 'admin') handleNavigate('admin');
            }} 
          />
        )}

        {currentView === 'report' && (
          <IncidentFormView onSubmitted={handleSubmitted} />
        )}

        {currentView === 'reporter_status' && (
          <ReporterStatusView
            onSelectIncident={handleSelectIncident}
            onNewReport={() => handleNavigate('report')}
            highlightedIncidentId={selectedIncidentId || undefined}
          />
        )}

        {currentView === 'responder' && (
          <ResponderDashboardView onSelectIncident={handleSelectIncident} />
        )}

        {currentView === 'admin' && (
          <AdminCommandCenterView
            onSelectIncident={handleSelectIncident}
            onOpenCheckin={() => setIsCheckinOpen(true)}
          />
        )}

        {currentView === 'details' && selectedIncidentId && (
          <IncidentDetailsView
            incidentId={selectedIncidentId}
            onBack={() => {
              if (currentRole === 'admin') handleNavigate('admin');
              else if (currentRole === 'responder') handleNavigate('responder');
              else handleNavigate('reporter_status');
            }}
          />
        )}

        {currentView === 'privacy' && <PrivacySafetyView />}
      </main>

      {/* Anonymous Safety Check-In Modal */}
      <SafetyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
      />

      {/* Global Accessibility Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="font-bold text-slate-800">ResQRoute Prototype</span>
            <span>• Privacy-First Emergency Incident Routing Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <button onClick={() => handleNavigate('privacy')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => handleNavigate('roles')} className="hover:underline">
              Demo Switcher
            </button>
            <button onClick={() => setIsCheckinOpen(true)} className="text-emerald-700 font-semibold hover:underline">
              Safe Check-In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
