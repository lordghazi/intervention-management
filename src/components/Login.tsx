import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { db } from '../db';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  setUserRole: (role: string) => void;
  setUsername: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserRole, setUsername }) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await db.users.where('username').equals(loginUsername).first();
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUsername(user.username);
    } else {
      alert('Identifiants invalides');
    }
  };

  // ... rest of the component remains the same
};

export default Login;