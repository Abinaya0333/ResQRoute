# ResQRoute: Privacy-First Emergency Coordination Platform

> **CRITICAL SAFETY ADVISORY:**  
> ResQRoute is a situational coordination and dispatch prototype designed for campuses, residential communities, and venues. **It does not replace 911/112 emergency services, municipal police, fire departments, or certified paramedic medical care.** In life-threatening emergencies, call official municipal emergency dispatch immediately.

---

## 1. Problem Statement
Emergency response coordination in dense environments (universities, multi-building apartment complexes, large venues) faces major bottlenecks:
- **Delayed & Inconsistent Information**: Reporters in distress struggle to convey structured details.
- **Privacy & Vigilantism Risks**: Traditional open community chat feeds leak personal names, phone numbers, exact private room numbers, and health records, inviting digital stalking and panic.
- **Dispatcher Overload**: First responders and operations staff receive duplicate, unvetted reports with unclear urgency levels.

---

## 2. The ResQRoute Solution
ResQRoute is an end-to-end emergency routing platform that converts raw community reports into verified, prioritized, assigned, and trackable milestones.

### Key Capabilities:
- **Role-Based Workflows**: Dedicated interfaces for Reporters, Field Responders, and Command Center Administrators.
- **Human-in-the-Loop Gemini AI Triage**: Analyzes free-text reports on the server side to recommend urgency classification, estimated confidence, and missing operational context.
- **Strict Advisory Labeling**: AI recommendations are clearly watermarked as algorithmic suggestions—never automated dispatch orders or medical diagnoses.
- **Dispatcher Sovereignty**: Administrators can verify reports, override AI priority, assign available units, and merge duplicate incident tickets.
- **Field Responder Status Beacon**: Responders can accept/reject assignments, trigger instant *"Help Arrived"* beacons, and close resolved calls.
- **Anonymous "I'm Safe" Check-In**: Community members can anonymously broadcast safety in active zones without sharing personal identifiable information (PII).

---

## 3. Architecture & Tech Stack
- **Frontend**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS with accessible emergency-operation color schemes, high contrast, and responsive layout.
- **Backend & AI**: Server-side Vite middleware calling `@google/genai` with `gemini-3.8-flash` (`httpOptions` tagged `aistudio-build`). Includes a deterministic keyword fallback if the Gemini service or key is unavailable.
- **Database & Auth**: Firebase Firestore and Firebase Authentication with security rules enforcing Role-Based Access Control (RBAC).
- **Data Persistence Strategy**: Cloud Firestore with automatic local recovery fallback ensuring uninterrupted prototype operation.

---

## 4. User Roles & Demo Credentials

| Role | Demo Identity | Primary Capabilities |
|---|---|---|
| **Reporter** | Elena Vance (`reporter@resqroute.internal`) | Submit incident with category, description, landmark, and optional photo; toggle full anonymity; track safe progress milestones. |
| **Responder** | Officer Marcus Cole (`responder@resqroute.internal`) | First-aid certified field unit; view assigned queue; accept/decline; transmit "Help arrived" beacon; mark resolution. |
| **Administrator** | Commander Sarah Jenkins (`admin@resqroute.internal`) | Supervisory command center; view simulated campus operations map; audit Gemini AI triage; override urgency; dispatch units; merge duplicates. |

*Switch between roles seamlessly using the top status bar switcher or the dedicated Demo Hub view.*

---

## 5. Data Model (`firebase-blueprint.json`)
The application defines 6 structured collections:
1. `users`: User profiles with authorized roles (`reporter`, `responder`, `admin`).
2. `incidents`: Central incident records with category, description, zone, status, urgency, and AI triage data.
3. `responders`: Verified campus units with duty status (`Available`, `Dispatched`, `Off-duty`), radio callsigns, and skillsets.
4. `incident_assignments`: Responder-to-incident dispatch records.
5. `incident_updates`: Chronological audit log with actor attribution and status transitions.
6. `safety_checkins`: Anonymous zone check-in counts and safe condition updates.

---

## 6. Incident Status Lifecycle
Every incident transitions through structured operational states:
1. `Reported`: Incident logged by user or anonymous student.
2. `Under review`: Incident undergoing triage and dispatcher assessment.
3. `Verified`: Admin validates report authenticity via security feeds or staff confirmation.
4. `Assigned`: Field responder dispatched to the approximate landmark.
5. `Responding`: Responder accepted assignment and is moving en route.
6. `Help arrived`: Responder confirmed physical contact on scene.
7. `Resolved`: Scene secured, stabilized, and closed with audit notes.
8. `Escalated`: Outside municipal 911 / EMS authorities requested.

---

## 7. Privacy & Safety Safeguards
- **Zero Public PII**: Public views never display student phone numbers, email addresses, medical history, or legal names.
- **Zone Geofencing**: Locations are generalized into campus landmarks (e.g., *"Library Block"*, *"Science Quad"*) rather than exact real-time personal GPS pins.
- **Tamper-Resistant Audit Trail**: Status changes and priority overrides record timestamped actor attribution.
- **Deterministic AI Fallback**: If network or API quota limits occur, a deterministic rule-based engine provides immediate classification.

---

## 8. Sample Demo Data & Judges' Repeatable Scenario
The prototype initializes with clearly watermarked training scenarios:
- **Primary Seeded Training Scenario (`INC-2026-0881`)**:
  - **Location**: *Library Block, 2nd Floor Mezzanine*
  - **Situation**: Unresponsive student fainting event with shallow breathing.
  - **AI Recommendation**: Medical category, High urgency with 94% confidence, flagged missing context (staircase access).
  - **Admin Action**: Dispatcher verified and assigned Officer Marcus Cole (CPR/AED certified).
  - **Responder Lifecycle**: Status transitions from *Responding* → *Help Arrived* → *Resolved*.
  - **Audit Trail**: Complete actor attribution log from submission to resolution.
- **Administrator "Reset Demo Scenario"**:
  - Located in the Admin Command Center. Resets the Library Block scenario and demo metrics safely without deleting user-submitted live incident reports.

---

## 9. Regulatory & Public Safety Disclaimers (What We Do Not Claim)
- **No Automated Medical Diagnosis**: The AI assistant provides algorithmic triage prioritization suggestions and missing detail flags; it **never** makes medical diagnoses or issues clinical directives.
- **Human-in-the-Loop Dispatch**: The system never places automated calls to municipal emergency services or commands field personnel without dispatcher authorization.
- **Simulated Performance Metrics**: Response times, heatmaps, and resolution figures displayed across demo views represent **simulated demonstration values**, not measured real-world benchmarks.
- **Prototype Status**: ResQRoute is a prototype architecture demonstrating privacy-by-design emergency routing principles.

---

## 10. Links & Resources
- **Development App URL**: https://ais-dev-f6dj3zjr3dz3henhhrpdhk-178720493079.asia-southeast1.run.app
- **Shared App URL**: https://ais-pre-f6dj3zjr3dz3henhhrpdhk-178720493079.asia-southeast1.run.app

---

## 11. Future Scope & Production Roadmap
- WebPush and SMS broadcast integration for severe weather lockdowns.
- Indoor BLE beacon micro-localization for multi-story buildings.
- Direct CAD (Computer-Aided Dispatch) integration with local 911 PSAP systems.
- Multilingual audio-to-text intake using Gemini Live transcribe.
