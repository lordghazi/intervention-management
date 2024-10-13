import React, { useState } from 'react';
import { Calendar, Edit, Trash, LogOut } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Intervention } from '../db';
import InterventionForm from './InterventionForm';

interface InterventionTableProps {
  userRole: string;
  username: string;
  onLogout: () => void;
}

const InterventionTable: React.FC<InterventionTableProps> = ({ userRole, username, onLogout }) => {
  const interventions = useLiveQuery(() => db.interventions.toArray());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Intervention | null>(null);

  const handleEdit = (intervention: Intervention) => {
    setEditingId(intervention.id!);
    setEditForm(intervention);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      await db.interventions.delete(id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm && editForm.id) {
      const now = new Date().toISOString();
      await db.interventions.update(editForm.id, {
        ...editForm,
        lastModifiedBy: username,
        lastModifiedAt: now
      });
      setEditingId(null);
      setEditForm(null);
    }
  };

  // ... rest of the component remains the same
};

export default InterventionTable;