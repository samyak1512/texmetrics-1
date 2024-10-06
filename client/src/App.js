import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      alert(error.message);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TexMetrics</h1>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}</h2>
          {!user.emailVerified && (
            <p className="text-red-500 mb-4">
              Please verify your email address to access all features.
            </p>
          )}
          {user.emailVerified ? (
            <DocumentUpload userId={user.uid} />
          ) : (
            <p className="text-gray-600">
              Email verification required to upload documents.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;