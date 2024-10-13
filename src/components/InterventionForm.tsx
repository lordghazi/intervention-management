import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { db, Intervention } from '../db';

interface InterventionFormProps {
  onInterventionAdded: () => void;
  username: string;
}

const InterventionForm: React.FC<InterventionFormProps> = ({ onInterventionAdded, username }) => {
  const [intervention, setIntervention] = useState<Omit<Intervention, 'id' | 'createdBy' | 'lastModifiedBy' | 'lastModifiedAt'>>({
    date: '',
    intervention: '',
    nombreBons: 0,
    cdh: 0,
    gdh: 0,
    totalHT: 0,
    sansVouchers: 0,
    natureIntervention: '',
    personneEnCharge: '',
    dateEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    await db.interventions.add({
      ...intervention,
      createdBy: username,
      lastModifiedBy: username,
      lastModifiedAt: now
    });
    setIntervention({
      date: '',
      intervention: '',
      nombreBons: 0,
      cdh: 0,
      gdh: 0,
      totalHT: 0,
      sansVouchers: 0,
      natureIntervention: '',
      personneEnCharge: '',
      dateEmail: ''
    });
    onInterventionAdded();
  };

  // ... rest of the component remains the same
};

export default InterventionForm;