import React, { useState } from 'react';
import { auth } from '../firebase';
import google from '../google.svg';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendEmailVerification
} from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (!email.endsWith('@nsut.ac.in')) {
          alert('Only @nsut.ac.in email addresses are allowed for sign up.');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert('Verification email sent. Please check your inbox and verify your email before logging in.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Get high-quality academic writing in minutes</h1>
        <p className="text-gray-600 mb-8">Trusted by 1 Mn+ academics worldwide</p>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-lg mb-4">
            "I am using TexMetrics for all my research and communication tasks. It's really efficient in improving the quality of my writing."
          </p>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <p className="font-semibold">Professor</p>
              <p className="text-gray-600">Netaji Subhas University of Technology, New Delhi</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 mr-2">★</span>
          <p>Rated Excellent on Trustpilot</p>
        </div>
      </div>
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-2">Hi, Welcome back</h2>
        <p className="text-gray-600 mb-8">Log in to TexMetrics</p>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <img src={google} alt="Google" className="w-6 h-6 mr-2" />
          Continue with Google
        </button>
        <div className="flex items-center mb-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            required
          />
          {isSignUp && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              required
            />
          )}
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md mb-4">
            {isSignUp ? 'Sign Up' : 'Proceed'}
          </button>
        </form>
        <p className="text-center">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 font-semibold"
          >
            {isSignUp ? 'Log In' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;