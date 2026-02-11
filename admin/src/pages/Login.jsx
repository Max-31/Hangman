import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onLogin = async (data) => {
    try {
      // I'm mapping the form input 'adminID' to 'userName' for the API call
      const { adminID, password } = data;
      
      const result = await api.post('/auth/login', { 
        userName: adminID, 
        password 
      });

      // I'm Checking if the user = admin
      if (result.data.user.role !== 'admin') {
        toast.error("Access Denied: You are not an Admin.");
        return;
      }

      toast.success("Welcome, Admin!");
      navigate('/dashboard');

    } catch (err) {
      const errMsg = err.response?.data?.message || "Login Failed";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-dark p-4">
      <div className="w-full max-w-md bg-royal-light/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-royal-light/30">
        <h1 className="text-3xl font-bold text-gold-vibrant mb-6 text-center tracking-wider">
          ADMIN ACCESS
        </h1>
        
        <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
          
          {/* Admin ID / Username Field */}
          <div>
            <label className="block text-gold-soft/80 text-sm font-medium mb-2">
              Admin ID
            </label>
            <input 
              type="text" 
              className="w-full bg-royal-dark/50 border border-royal-light/30 rounded-xl px-4 py-3 text-gold-soft focus:outline-none focus:border-gold-vibrant transition-colors"
              placeholder="Enter Admin ID"
              {...register("adminID", { required: true })}
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-gold-soft/80 text-sm font-medium mb-2">
              Password
            </label>
            <input 
              type="password" 
              className="w-full bg-royal-dark/50 border border-royal-light/30 rounded-xl px-4 py-3 text-gold-soft focus:outline-none focus:border-gold-vibrant transition-colors"
              placeholder="Enter Password"
              {...register("password", { required: true })}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold-vibrant hover:bg-gold-vibrant/90 text-royal-dark font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-gold-vibrant/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "ENTER SYSTEM"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;