import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import DocumentUpload from './components/DocumentUpload';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Processing App</h1>
      {user ? (
        <DocumentUpload userId={user.uid} />
      ) : (
        <Login onLogin={() => {}} />
      )}
    </div>
  );
}

export default App;