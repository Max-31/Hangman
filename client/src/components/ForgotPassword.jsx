import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import './ForgotPassword.css'; // Import the new CSS file

const ForgotPassword = () => {
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL;

    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${url}/auth/forgot-password`, { email });
            toast.success("OTP Sent to your email!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${url}/auth/reset-password`, { email, otp, newPassword });
            toast.success("Password Changed Successfully!");
            navigate('/login'); // Redirect to login
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fp-container">
            <div className="fp-card">
                <h2 className="fp-title">
                    {step === 1 ? "Forgot Password?" : "Reset Password"}
                </h2>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="fp-form">
                        <p className="fp-description">
                            Enter your registered email address to receive a verification code.
                        </p>
                        <div className="fp-input-group">
                            <FaEnvelope className="fp-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="fp-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="fp-btn-primary"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="fp-form">
                        <div className="fp-input-group">
                            <FaKey className="fp-icon" />
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                className="fp-input fp-input-otp"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div className="fp-input-group">
                            <FaLock className="fp-icon" />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="fp-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="fp-btn-success"
                        >
                            {loading ? "Resetting..." : "Change Password"}
                        </button>
                    </form>
                )}

                <div className="fp-footer">
                    <button 
                        onClick={() => navigate('/login')}
                        className="fp-back-link"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;