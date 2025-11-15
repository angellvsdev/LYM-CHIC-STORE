import React from 'react';
import { useAuth } from '../../../hooks/useAuth';

const DebugUserInfo = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-4 bg-yellow-100 text-yellow-800">Usuario no autenticado</div>;
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800">
      <h3>Debug - Información del Usuario:</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>Rol actual: <strong>{user.role}</strong></p>
      <p>Redirección esperada: <strong>{user.role === 'admin' ? '/admin' : '/profile'}</strong></p>
    </div>
  );
};

export default DebugUserInfo;
