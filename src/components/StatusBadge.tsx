import React from 'react';
import { IncidentStatus, IncidentUrgency, IncidentCategory } from '../types';
import { 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Wrench, 
  CloudRain, 
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Send,
  Navigation
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: IncidentStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs font-semibold tracking-wide';

  switch (status) {
    case 'Reported':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Reported
        </span>
      );
    case 'Under review':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Under review
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-300 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          Verified
        </span>
      );
    case 'Assigned':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-300 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          Assigned
        </span>
      );
    case 'Responding':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-300 ${sizeClasses}`}>
          <Navigation className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
          Responding
        </span>
      );
    case 'Help arrived':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Help arrived
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
          Resolved
        </span>
      );
    case 'Escalated':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Escalated
        </span>
      );
    default:
      return <span className={`inline-flex rounded-full bg-gray-100 text-gray-800 border border-gray-200 ${sizeClasses}`}>{status}</span>;
  }
};

export const UrgencyBadge: React.FC<{ urgency: IncidentUrgency; isOverridden?: boolean }> = ({ urgency, isOverridden }) => {
  let color = 'bg-slate-100 text-slate-800 border-slate-300';
  if (urgency === 'Critical') color = 'bg-red-100 text-red-900 border-red-300';
  else if (urgency === 'High') color = 'bg-orange-100 text-orange-900 border-orange-300';
  else if (urgency === 'Medium') color = 'bg-amber-100 text-amber-900 border-amber-300';
  else if (urgency === 'Low') color = 'bg-emerald-100 text-emerald-900 border-emerald-300';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${color}`}>
      <span>Urgency: {urgency}</span>
      {isOverridden && <span className="ml-1 text-[10px] font-normal lowercase tracking-normal text-slate-500">(overridden)</span>}
    </span>
  );
};

export const CategoryIcon: React.FC<{ category: IncidentCategory; className?: string }> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'medical':
      return <HeartPulse className={`${className} text-rose-600`} />;
    case 'security':
      return <ShieldAlert className={`${className} text-indigo-600`} />;
    case 'fire':
      return <Flame className={`${className} text-orange-600`} />;
    case 'facility':
      return <Wrench className={`${className} text-amber-600`} />;
    case 'weather':
      return <CloudRain className={`${className} text-blue-600`} />;
    default:
      return <HelpCircle className={`${className} text-slate-600`} />;
  }
};

export const DemoDataBadge: React.FC<{ label?: string; size?: 'xs' | 'sm' }> = ({ label = 'Demo Data', size = 'xs' }) => {
  const sizeClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span 
      title="Simulated sample scenario data for training and platform demonstration"
      className={`inline-flex items-center gap-1 font-mono font-bold tracking-tight uppercase rounded bg-purple-100 text-purple-800 border border-purple-300 ${sizeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
      <span>{label}</span>
    </span>
  );
};
