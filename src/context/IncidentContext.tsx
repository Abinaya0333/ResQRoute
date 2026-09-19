import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, Responder, IncidentAssignment, IncidentUpdate, SafetyCheckin, IncidentStatus, IncidentUrgency } from '../types';
import { DEMO_INCIDENTS, DEMO_RESPONDERS, DEMO_UPDATES, DEMO_SAFETY_CHECKINS } from '../lib/demoData';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

interface IncidentContextType {
  incidents: Incident[];
  responders: Responder[];
  updates: IncidentUpdate[];
  safetyCheckins: SafetyCheckin[];
  createIncident: (incidentData: Partial<Incident>) => Promise<string>;
  updateIncidentStatus: (
    incidentId: string, 
    newStatus: IncidentStatus, 
    actorName: string, 
    actorRole: 'admin' | 'responder' | 'reporter', 
    message?: string
  ) => Promise<void>;
  overrideUrgency: (incidentId: string, newUrgency: IncidentUrgency, adminNotes?: string) => Promise<void>;
  assignResponder: (incidentId: string, responderId: string, adminName: string) => Promise<void>;
  updateResponderStatus: (responderId: string, status: 'Available' | 'Dispatched' | 'Off-duty') => Promise<void>;
  mergeDuplicates: (primaryId: string, duplicateId: string, adminName: string) => Promise<void>;
  submitSafetyCheckin: (zone: string, status: 'safe' | 'need_assistance', note?: string) => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  getUpdatesForIncident: (incidentId: string) => IncidentUpdate[];
  resetToDemoData: () => void;
  isSyncing: boolean;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('resqroute_incidents');
    return saved ? JSON.parse(saved) : DEMO_INCIDENTS;
  });

  const [responders, setResponders] = useState<Responder[]>(() => {
    const saved = localStorage.getItem('resqroute_responders');
    return saved ? JSON.parse(saved) : DEMO_RESPONDERS;
  });

  const [updates, setUpdates] = useState<IncidentUpdate[]>(() => {
    const saved = localStorage.getItem('resqroute_updates');
    return saved ? JSON.parse(saved) : DEMO_UPDATES;
  });

  const [safetyCheckins, setSafetyCheckins] = useState<SafetyCheckin[]>(() => {
    const saved = localStorage.getItem('resqroute_checkins');
    return saved ? JSON.parse(saved) : DEMO_SAFETY_CHECKINS;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync state to local storage for seamless persistence
  useEffect(() => {
    localStorage.setItem('resqroute_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('resqroute_responders', JSON.stringify(responders));
  }, [responders]);

  useEffect(() => {
    localStorage.setItem('resqroute_updates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('resqroute_checkins', JSON.stringify(safetyCheckins));
  }, [safetyCheckins]);

  // Attempt real-time Firestore synchronization if available
  useEffect(() => {
    let unsubscribeIncidents: (() => void) | undefined;
    let unsubscribeUpdates: (() => void) | undefined;
    let unsubscribeResponders: (() => void) | undefined;
    let unsubscribeCheckins: (() => void) | undefined;

    try {
      const qIncidents = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
      unsubscribeIncidents = onSnapshot(qIncidents, (snapshot) => {
        if (!snapshot.empty) {
          const remoteIncidents: Incident[] = [];
          snapshot.forEach((d) => {
            remoteIncidents.push({ id: d.id, ...d.data() } as Incident);
          });
          setIncidents((prev) => {
            const map = new Map(prev.map(i => [i.id, i]));
            remoteIncidents.forEach(r => map.set(r.id, r));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          });
        }
      }, (err) => {
        console.info('[ResQRoute Sync] Firestore incident listener status:', err.message);
      });

      const qUpdates = query(collection(db, 'incident_updates'), orderBy('timestamp', 'desc'));
      unsubscribeUpdates = onSnapshot(qUpdates, (snapshot) => {
        if (!snapshot.empty) {
          const remoteUpdates: IncidentUpdate[] = [];
          snapshot.forEach((d) => {
            remoteUpdates.push({ id: d.id, ...d.data() } as IncidentUpdate);
          });
          setUpdates((prev) => {
            const map = new Map(prev.map(u => [u.id, u]));
            remoteUpdates.forEach(u => map.set(u.id, u));
            return Array.from(map.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          });
        }
      }, (err) => {
        console.info('[ResQRoute Sync] Firestore updates listener status:', err.message);
      });

      const qResponders = collection(db, 'responders');
      unsubscribeResponders = onSnapshot(qResponders, (snapshot) => {
        if (!snapshot.empty) {
          const remoteResponders: Responder[] = [];
          snapshot.forEach((d) => {
            remoteResponders.push({ id: d.id, ...d.data() } as Responder);
          });
          setResponders((prev) => {
            const map = new Map(prev.map(r => [r.id, r]));
            remoteResponders.forEach(r => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.info('[ResQRoute Sync] Firestore responders listener status:', err.message);
      });

      const qCheckins = query(collection(db, 'safety_checkins'), orderBy('timestamp', 'desc'));
      unsubscribeCheckins = onSnapshot(qCheckins, (snapshot) => {
        if (!snapshot.empty) {
          const remoteCheckins: SafetyCheckin[] = [];
          snapshot.forEach((d) => {
            remoteCheckins.push({ id: d.id, ...d.data() } as SafetyCheckin);
          });
          setSafetyCheckins((prev) => {
            const map = new Map(prev.map(c => [c.id, c]));
            remoteCheckins.forEach(c => map.set(c.id, c));
            return Array.from(map.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          });
        }
      }, (err) => {
        console.info('[ResQRoute Sync] Firestore checkins listener status:', err.message);
      });
    } catch (e) {
      console.info('[ResQRoute Sync] Using hybrid local/cloud storage.');
    }

    return () => {
      if (unsubscribeIncidents) unsubscribeIncidents();
      if (unsubscribeUpdates) unsubscribeUpdates();
      if (unsubscribeResponders) unsubscribeResponders();
      if (unsubscribeCheckins) unsubscribeCheckins();
    };
  }, []);

  const createIncident = async (data: Partial<Incident>): Promise<string> => {
    setIsSyncing(true);
    const newId = `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: newId,
      reporterId: data.reporterId || 'anon_user',
      reporterName: data.reporterName || 'Campus Resident',
      reporterAnonymous: !!data.reporterAnonymous,
      category: data.category || 'other',
      description: data.description || '',
      locationName: data.locationName || 'General Campus',
      zone: data.zone || 'General Campus',
      mapCoordinates: data.mapCoordinates || { x: 30 + Math.floor(Math.random() * 40), y: 30 + Math.floor(Math.random() * 40) },
      imageUrl: data.imageUrl || '',
      status: 'Reported',
      urgency: data.urgency || 'Medium',
      originalAiUrgency: data.aiAnalysis?.urgency || data.urgency || 'Medium',
      urgencyOverridden: false,
      aiAnalysis: data.aiAnalysis,
      createdAt: now,
      updatedAt: now,
      isDemo: false,
    };

    const initialUpdate: IncidentUpdate = {
      id: `upd_${Date.now()}`,
      incidentId: newId,
      actorId: data.reporterId || 'anon_user',
      actorRole: 'reporter',
      actorName: data.reporterAnonymous ? 'Anonymous Reporter' : (data.reporterName || 'Reporter'),
      statusTo: 'Reported',
      message: `Incident submitted for approximate location ${newIncident.locationName}.`,
      timestamp: now,
    };

    setIncidents(prev => [newIncident, ...prev]);
    setUpdates(prev => [initialUpdate, ...prev]);

    // Firestore async persist
    try {
      await setDoc(doc(db, 'incidents', newId), {
        ...newIncident,
        serverTimestamp: serverTimestamp(),
      });
      await setDoc(doc(db, 'incident_updates', initialUpdate.id), initialUpdate);
    } catch (err) {
      console.warn('[ResQRoute Firestore] Saved to local state (Firestore note:', err, ')');
    } finally {
      setIsSyncing(false);
    }

    return newId;
  };

  const updateIncidentStatus = async (
    incidentId: string, 
    newStatus: IncidentStatus, 
    actorName: string, 
    actorRole: 'admin' | 'responder' | 'reporter',
    message?: string
  ) => {
    setIsSyncing(true);
    const now = new Date().toISOString();
    const current = incidents.find(i => i.id === incidentId);

    const updateRecord: IncidentUpdate = {
      id: `upd_${Date.now()}`,
      incidentId,
      actorId: actorRole,
      actorRole,
      actorName,
      statusFrom: current?.status,
      statusTo: newStatus,
      message: message || `Status changed from ${current?.status || 'Unknown'} to ${newStatus}.`,
      timestamp: now,
    };

    setIncidents(prev => prev.map(item => {
      if (item.id === incidentId) {
        return {
          ...item,
          status: newStatus,
          updatedAt: now,
        };
      }
      return item;
    }));

    setUpdates(prev => [updateRecord, ...prev]);

    try {
      await updateDoc(doc(db, 'incidents', incidentId), {
        status: newStatus,
        updatedAt: now,
      });
      await setDoc(doc(db, 'incident_updates', updateRecord.id), updateRecord);
    } catch (err) {
      console.warn('[ResQRoute] Synced locally:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const overrideUrgency = async (incidentId: string, newUrgency: IncidentUrgency, adminNotes?: string) => {
    setIsSyncing(true);
    const now = new Date().toISOString();
    const current = incidents.find(i => i.id === incidentId);

    setIncidents(prev => prev.map(item => {
      if (item.id === incidentId) {
        return {
          ...item,
          urgency: newUrgency,
          urgencyOverridden: true,
          adminNotes: adminNotes || item.adminNotes,
          updatedAt: now,
        };
      }
      return item;
    }));

    const updateRecord: IncidentUpdate = {
      id: `upd_${Date.now()}`,
      incidentId,
      actorId: 'admin',
      actorRole: 'admin',
      actorName: 'Administrator Command',
      statusTo: current?.status || 'Under review',
      message: `Administrator adjusted urgency to ${newUrgency}. Note: ${adminNotes || 'Manual priority adjustment'}`,
      timestamp: now,
    };
    setUpdates(prev => [updateRecord, ...prev]);

    try {
      await updateDoc(doc(db, 'incidents', incidentId), {
        urgency: newUrgency,
        urgencyOverridden: true,
        adminNotes: adminNotes || current?.adminNotes || '',
        updatedAt: now,
      });
      await setDoc(doc(db, 'incident_updates', updateRecord.id), updateRecord);
    } catch (err) {
      console.warn('[ResQRoute Firestore] Urgency override local fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const assignResponder = async (incidentId: string, responderId: string, adminName: string) => {
    setIsSyncing(true);
    const responder = responders.find(r => r.id === responderId);
    const now = new Date().toISOString();

    setIncidents(prev => prev.map(item => {
      if (item.id === incidentId) {
        return {
          ...item,
          assignedResponderId: responderId,
          assignedResponderName: responder ? `${responder.name} (${responder.type})` : 'Assigned Responder',
          status: 'Assigned',
          updatedAt: now,
        };
      }
      return item;
    }));

    setResponders(prev => prev.map(r => {
      if (r.id === responderId) {
        return { ...r, status: 'Dispatched' };
      }
      return r;
    }));

    const updateRecord: IncidentUpdate = {
      id: `upd_${Date.now()}`,
      incidentId,
      actorId: 'admin',
      actorRole: 'admin',
      actorName: adminName,
      statusTo: 'Assigned',
      message: `Assigned incident to ${responder?.name || 'responder'} (${responder?.type || 'field unit'}).`,
      timestamp: now,
    };
    setUpdates(prev => [updateRecord, ...prev]);

    const assignmentId = `asgn_${incidentId}_${responderId}_${Date.now()}`;
    const assignmentRecord: IncidentAssignment = {
      id: assignmentId,
      incidentId,
      responderId,
      assignedBy: adminName,
      status: 'Accepted',
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Persist incident assignment
      await updateDoc(doc(db, 'incidents', incidentId), {
        assignedResponderId: responderId,
        assignedResponderName: responder ? `${responder.name} (${responder.type})` : 'Assigned Responder',
        status: 'Assigned',
        updatedAt: now,
      });
      // Persist assignment record in incident_assignments collection
      await setDoc(doc(db, 'incident_assignments', assignmentId), assignmentRecord);
      // Persist timeline log
      await setDoc(doc(db, 'incident_updates', updateRecord.id), updateRecord);
      // Persist responder dispatched status
      if (responder) {
        await setDoc(doc(db, 'responders', responderId), {
          ...responder,
          status: 'Dispatched',
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[ResQRoute Firestore] Assign responder local fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateResponderStatus = async (responderId: string, status: 'Available' | 'Dispatched' | 'Off-duty') => {
    setResponders(prev => prev.map(r => {
      if (r.id === responderId) {
        return { ...r, status };
      }
      return r;
    }));

    try {
      const resp = responders.find(r => r.id === responderId);
      if (resp) {
        await setDoc(doc(db, 'responders', responderId), {
          ...resp,
          status,
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[ResQRoute Firestore] Responder status update notice:', err);
    }
  };

  const mergeDuplicates = async (primaryId: string, duplicateId: string, adminName: string) => {
    setIsSyncing(true);
    const now = new Date().toISOString();
    const primaryItem = incidents.find(i => i.id === primaryId);
    const updatedMergedChildIds = primaryItem?.mergedChildIds ? [...primaryItem.mergedChildIds, duplicateId] : [duplicateId];

    setIncidents(prev => prev.map(item => {
      if (item.id === duplicateId) {
        return {
          ...item,
          duplicateOf: primaryId,
          status: 'Resolved',
          adminNotes: `Merged as duplicate into ${primaryId}.`,
          updatedAt: now,
        };
      }
      if (item.id === primaryId) {
        return {
          ...item,
          mergedChildIds: updatedMergedChildIds,
          updatedAt: now,
        };
      }
      return item;
    }));

    const updateRecord: IncidentUpdate = {
      id: `upd_${Date.now()}`,
      incidentId: primaryId,
      actorId: 'admin',
      actorRole: 'admin',
      actorName: adminName,
      statusTo: 'Verified',
      message: `Administrator linked report ${duplicateId} as a duplicate correlation.`,
      timestamp: now,
    };
    setUpdates(prev => [updateRecord, ...prev]);

    try {
      // Update primary incident with merged child reference
      await updateDoc(doc(db, 'incidents', primaryId), {
        mergedChildIds: updatedMergedChildIds,
        updatedAt: now,
      });
      // Update duplicate incident with duplicateOf and resolved status
      await updateDoc(doc(db, 'incidents', duplicateId), {
        duplicateOf: primaryId,
        status: 'Resolved',
        adminNotes: `Merged as duplicate into ${primaryId}.`,
        updatedAt: now,
      });
      // Persist timeline log
      await setDoc(doc(db, 'incident_updates', updateRecord.id), updateRecord);
    } catch (err) {
      console.warn('[ResQRoute Firestore] Merge duplicate local fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const submitSafetyCheckin = async (zone: string, status: 'safe' | 'need_assistance', note?: string) => {
    const newCheckin: SafetyCheckin = {
      id: `chk_${Date.now()}`,
      zone,
      status,
      note: note?.trim() || undefined,
      timestamp: new Date().toISOString(),
      isDemo: false,
    };

    setSafetyCheckins(prev => [newCheckin, ...prev]);

    try {
      await setDoc(doc(db, 'safety_checkins', newCheckin.id), newCheckin);
    } catch (err) {
      console.info('[ResQRoute Checkin] Local update complete.');
    }
  };

  const getIncidentById = (id: string) => {
    return incidents.find(i => i.id === id);
  };

  const getUpdatesForIncident = (incidentId: string) => {
    return updates.filter(u => u.incidentId === incidentId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const resetToDemoData = () => {
    // Preserve user-created (non-demo) incidents and records while resetting seeded demo scenarios
    setIncidents(prev => {
      const userIncidents = prev.filter(i => !i.isDemo);
      return [...userIncidents, ...DEMO_INCIDENTS];
    });
    setResponders(DEMO_RESPONDERS);
    setUpdates(prev => {
      const userUpdates = prev.filter(u => !u.id.startsWith('upd_0'));
      return [...userUpdates, ...DEMO_UPDATES];
    });
    setSafetyCheckins(prev => {
      const userCheckins = prev.filter(c => !c.isDemo);
      return [...userCheckins, ...DEMO_SAFETY_CHECKINS];
    });
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        responders,
        updates,
        safetyCheckins,
        createIncident,
        updateIncidentStatus,
        overrideUrgency,
        assignResponder,
        updateResponderStatus,
        mergeDuplicates,
        submitSafetyCheckin,
        getIncidentById,
        getUpdatesForIncident,
        resetToDemoData,
        isSyncing,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};
