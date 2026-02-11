import {React, useState} from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Auth.css'
import Loader from './Loader'

const url = import.meta.env.VITE_API_URL;

const Auth = () => {

  const location= useLocation();
  const navigate= useNavigate()
  const isSignUp= location.pathname === '/signUp';
  const {
    register,
    handleSubmit,
    // formState: { errors, isSubmitting },
    formState: { isSubmitting },
  } = useForm();

  const [loading, setLoading]= useState(false);

  const credNew= async(data)=>{
    setLoading(true);
    try{
      const {userName, password}= data;

      // Minimum 2sec delay promise
      const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));

      // const result= await axios.post(`${url}/auth/signUp`, {userName, password});
      const apiRequest= axios.post(`${url}/auth/signUp`, {userName, password});

      // Wait for BOTH
      const [_, result] = await Promise.all([minLoaderTime, apiRequest]);
    
      toast.success(result.data.message);
      // localStorage.setItem("userName", userName);
      navigate('/login');
      return;
    }
    catch(err){
      console.log(err.message);
      // toast.error("OOPS!" + err.message);
      const errMsg= err.response?.data?.message || "Issue in SignUP";
      toast.error("OOPS! " + errMsg);
    }
    finally{
      setLoading(false);
    }
  }
  
  const credCheck= async(data)=>{
    setLoading(true);
    try{      
      const {userName, password}= data;

      const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));

      // const result= await axios.post(`${url}/auth/login`, {userName, password});
      const apiRequest= axios.post(`${url}/auth/login`, {userName, password});

      const [_, result]= await Promise.all([minLoaderTime, apiRequest]);
      
      // localStorage.setItem("userName", userName);
      localStorage.setItem("userName", result.data.user.userName);
      localStorage.setItem("userID", result.data.user._id);
      localStorage.setItem("role", result.data.user.role || "Player");
      
      toast.success("DONE " + result.data.message);
      navigate('/');
      return;
    }
    catch(err){
      // toast.error("OOPS!" + err.message);
      const errMsg= err.response?.data?.message || "Issue in Login";
      toast.error("OOPS! " + errMsg);
    }
    finally{
      setLoading(false);
    }
  }

  if(loading || isSubmitting){
    return <Loader />
  }

  return (
    <div className="outerLoginContainer">
      <div className="loginContainer">
        <form onSubmit= {isSignUp? handleSubmit(credNew): handleSubmit(credCheck)}>
          {/* Heading */}
          <div className="formHeading">
            <h2>{isSignUp? "SignUp" : "Login"}</h2>
          </div>

          {/* Username Field */}
          <div className="inputBox">
            <input
              type="text"
              id="userName"
              placeholder="Enter Username"
              {
                ...register("userName", {
                  required: true
                })
              }
            />
          </div>

          {/* Password Field */}
          <div className="inputBox">
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              {
                ...register("password", {
                  required: true
                })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="btn">
            <button type="submit" className="loginBtn">
              {isSubmitting? "Submitting" : (isSignUp? "SignUp" : "Login")}
            </button>
          </div>

          {/* Redirect Link */}
          <div className="signUp">
              {
                isSignUp
                ? 
                <p>
                  Already have Account? <Link to='/login'>Login</Link>
                </p> 
                : 
                <p>
                  New Here? <Link to='/signUp'>SignUp</Link>
                </p> 
              }
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth