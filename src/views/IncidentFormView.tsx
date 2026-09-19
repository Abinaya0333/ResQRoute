import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { IncidentCategory } from '../types';
import { CAMPUS_ZONES } from '../lib/demoData';
import { analyzeIncidentReport } from '../lib/geminiClient';
import { 
  ShieldAlert, 
  Sparkles, 
  Send, 
  Upload, 
  Lock, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

export const IncidentFormView: React.FC<{ onSubmitted: (incidentId: string) => void }> = ({ onSubmitted }) => {
  const { createIncident } = useIncidents();
  const { currentUser } = useAuth();

  const [category, setCategory] = useState<IncidentCategory>('medical');
  const [description, setDescription] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [zone, setZone] = useState<string>(CAMPUS_ZONES[0]);
  const [reporterAnonymous, setReporterAnonymous] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiStatusMsg, setAiStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleImagePreset = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Please provide a detailed description (at least 10 characters) to assist responders.');
      return;
    }
    if (!locationName.trim() || locationName.trim().length < 3) {
      setErrorMsg('Please specify an approximate landmark or building name.');
      return;
    }

    setIsSubmitting(true);
    setAiStatusMsg('Executing Gemini AI safety triage & situational analysis...');

    try {
      // Analyze with Gemini (or deterministic fallback)
      const aiAnalysis = await analyzeIncidentReport({
        category,
        description,
        locationName,
        zone,
      });

      setAiStatusMsg('Saving incident report and notifying command center...');

      const newId = await createIncident({
        reporterId: currentUser?.uid || 'anon_user',
        reporterName: reporterAnonymous ? 'Anonymous Reporter' : (currentUser?.displayName || 'Reporter'),
        reporterAnonymous,
        category: aiAnalysis.category || category,
        description,
        locationName,
        zone,
        imageUrl: imageUrl.trim() || undefined,
        urgency: aiAnalysis.urgency || 'Medium',
        aiAnalysis,
      });

      setIsSubmitting(false);
      onSubmitted(newId);
    } catch (err: any) {
      console.error('Incident submission error:', err);
      setIsSubmitting(false);
      setErrorMsg('Failed to submit incident report. Please retry or contact dispatch directly.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-rose-700 mb-1">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-900">Emergency Incident Intake Form</h2>
        </div>
        <p className="text-xs text-slate-600">
          Submit immediate community, venue, or campus safety issues. Reports are audited by on-duty administrators and routed to verified local responders.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-0.5">
          <span className="font-semibold">Privacy-First Architecture:</span> Do not disclose personal social security numbers, private passwords, or exact room keys. Coordinates are generalized to approximate landmarks.
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-lg p-3 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Incident Category <span className="text-rose-600">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'medical', label: 'Medical Assistance', sub: 'Fainting, injuries, trauma' },
              { id: 'security', label: 'Security & Safety', sub: 'Trespass, disturbance, escort' },
              { id: 'fire', label: 'Fire & Hazard', sub: 'Smoke, gas odor, electrical' },
              { id: 'facility', label: 'Facility Urgency', sub: 'Pipe burst, elevator entrapment' },
              { id: 'weather', label: 'Severe Weather', sub: 'Downed limbs, localized flooding' },
              { id: 'other', label: 'General / Other', sub: 'Other urgent campus needs' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as IncidentCategory)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  category === cat.id
                    ? 'border-rose-600 bg-rose-50/50 text-slate-900 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="text-xs font-bold capitalize">{cat.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{cat.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Location & Zone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Approximate Landmark / Building <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. W.T. Young Library Block, 2nd Floor Mezzanine"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campus Operations Zone <span className="text-rose-600">*</span>
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
            >
              {CAMPUS_ZONES.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Incident Description <span className="text-rose-600">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what occurred, number of individuals affected, observable injuries, immediate hazards, and any accessible entrance..."
            className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 placeholder:text-slate-400"
          ></textarea>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
            <span>Gemini AI will analyze this description to suggest priority and detect missing details.</span>
            <span>{description.length} chars</span>
          </div>
        </div>

        {/* Optional Image URL / Sample Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Optional Scene Image (URL or Sample Asset)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/scene-photo.jpg (or pick sample below)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
            />
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-500">Sample scene presets:</span>
            <button
              type="button"
              onClick={() => handleImagePreset('https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&auto=format&fit=crop&q=60')}
              className="text-[11px] text-rose-700 hover:underline bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
            >
              Library Study Hall
            </button>
            <button
              type="button"
              onClick={() => handleImagePreset('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60')}
              className="text-[11px] text-rose-700 hover:underline bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
            >
              Basement Pipe Dripping
            </button>
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs font-semibold text-slate-800">Submit Anonymously</span>
              <p className="text-[11px] text-slate-500">Hides your name and email address from responder view</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={reporterAnonymous}
            onChange={(e) => setReporterAnonymous(e.target.checked)}
            className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
          />
        </div>

        {/* AI Advisory Callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-semibold">Gemini AI Advisory Protocol:</strong>
            <p className="text-[11px] text-slate-500 mt-0.5">
              The AI triage engine will recommend an urgency classification and highlight potential missing details for dispatchers. All automated assessments require human dispatcher confirmation before escalation.
            </p>
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-2 flex justify-end">
          <button
            id="submit-incident-btn"
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{aiStatusMsg || 'Analyzing & Submitting...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Incident to ResQRoute</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
