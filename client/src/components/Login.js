import React, { useState } from 'react';
import { auth } from '../firebase';
import google from '../google.svg';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('Dr.');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [receiveNews, setReceiveNews] = useState(true);
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with additional information
      await updateProfile(user, {
        displayName: `${title} ${firstName} ${lastName}`,
      });

      // Send email verification
      await sendEmailVerification(user);

      // You might want to store additional user information in your database here

      alert('Account created successfully! Please check your email for verification.');
      setIsSignUp(false); // Switch back to login view
    } catch (error) {
      console.error('Error creating account:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="mb-12">
          <img src="/path-to-paperpal-logo.svg" alt="Paperpal" className="h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-[#1E293B]">Get high-quality academic writing in minutes</h1>
        <p className="text-[#64748B] mb-8">Trusted by 1 Mn+ academics worldwide</p>
        <div className="bg-[#EEF2FF] p-6 rounded-lg mb-8">
          <p className="text-lg mb-4 text-[#1E293B]">
            "I am using TexMetrics for all my research and communication tasks. It's really efficient in improving the quality of my writing."
          </p>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full mr-4 flex items-center justify-center text-white">
              <span className="text-2xl"></span>
            </div>
            <div>
              <p className="font-semibold text-[#1E293B]">Professor</p>
              <p className="text-[#64748B]">Netaji Subhas University of Technology, New Delhi</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 mr-2">★</span>
          <p className="text-[#64748B]">Rated Excellent on Trustpilot</p>
        </div>
      </div>
      <div className="w-1/2 p-12 flex flex-col justify-center">
        {isSignUp ? (
          <>
            <h2 className="text-3xl font-bold mb-2 text-[#1E293B]">Create your free account</h2>
            <p className="text-[#64748B] mb-8">One account for Paperpal, Editage and more...</p>
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full p-3 border border-[#E2E8F0] rounded-md mb-4 text-[#1E293B] hover:bg-gray-50"
            >
              <img src={google} alt="Google" className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
              <span className="px-4 text-[#64748B]">or</span>
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
            </div>
            <form onSubmit={handleSignUp}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
                className="w-full p-3 border border-[#E2E8F0] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password*"
                  className="w-full p-3 border border-[#E2E8F0] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button type="button" className="absolute right-3 top-3 text-gray-400">
                  {/* Add eye icon here */}
                </button>
              </div>
              <div className="flex mb-4">
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-1/4 p-3 border border-[#E2E8F0] rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Dr.</option>
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Mrs.</option>
                </select>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name*"
                  className="w-3/4 p-3 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name*"
                className="w-full p-3 border border-[#E2E8F0] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-[#64748B]">
                    I have read and agree to <a href="#" className="text-blue-500">privacy policy</a>, <a href="#" className="text-blue-500">terms of use</a> and <a href="#" className="text-blue-500">cookie policy</a>.
                  </span>
                </label>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={receiveNews}
                    onChange={(e) => setReceiveNews(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-[#64748B]">I want to receive product news</span>
                </label>
              </div>
              <button type="submit" className="w-full p-3 bg-[#4F46E5] text-white rounded-md mb-4 hover:bg-[#4338CA]">
                Create account
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2 text-[#1E293B]">Hi, Welcome back</h2>
            <p className="text-[#64748B] mb-8">Log in to Paperpal</p>
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full p-3 border border-[#E2E8F0] rounded-md mb-4 text-[#1E293B] hover:bg-gray-50"
            >
              <img src={google} alt="Google" className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
              <span className="px-4 text-[#64748B]">or</span>
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
                className="w-full p-3 border border-[#E2E8F0] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password*"
                className="w-full p-3 border border-[#E2E8F0] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="submit" className="w-full p-3 bg-[#818CF8] text-white rounded-md mb-4 hover:bg-[#6366F1]">
                Proceed
              </button>
            </form>
          </>
        )}
        <p className="text-center text-[#64748B]">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#818CF8] font-semibold hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;