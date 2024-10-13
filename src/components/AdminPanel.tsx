import React, { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'input' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setNewUser({ username: '', password: '', role: 'input' });
        fetchUsers();
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchUsers();
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // ... rest of the component remains the same
};

export default AdminPanel;