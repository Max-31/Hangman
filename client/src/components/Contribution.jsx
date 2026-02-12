import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form"; // 1. Import Hook Form
import ContributionPromo from "./ContributionPromo";
import {
  FaPlus,
  FaList,
  FaGamepad,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaFilter,
  FaChevronDown,
  FaLightbulb,
  FaSync,
} from "react-icons/fa";
import "./Contribution.css";
import Loader from "./Loader";

const Contribution = () => {
  const navigate= useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const userID = localStorage.getItem("userID");

  // --- REACT HOOK FORM SETUP ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // State
  const [activeTab, setActiveTab] = useState("ADD");
  const [type, setType] = useState("word");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Data State
  const [genres, setGenres] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- FETCH HELPERS ---
  const fetchGenres = async () => {
    setLoading(true);
    try {
      const minLoaderTime = new Promise((resolve) => setTimeout(resolve, 1500));
      const apiRequest = axios.get(`${url}/contribution/genres`, {
        withCredentials: true,
      });

      const [_, res] = await Promise.all([minLoaderTime, apiRequest]);
      setGenres(res.data);
    } catch (err) {
      console.error("Error fetching genres", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      if (!userID) return;
      const minLoaderTime = new Promise((resolve) => setTimeout(resolve, 1500));
      const apiRequest = axios.get(
        `${url}/contribution/my-requests/${userID}`,
        {
          withCredentials: true,
        }
      );

      const [_, res] = await Promise.all([minLoaderTime, apiRequest]);
      setMyRequests(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth= ()=>{
    const currentUserID= localStorage.getItem("userID");
    if(!currentUserID){
        toast.error("Please login first!");
        navigate('/login');
        return;
    }
  }

  useEffect(
    ()=>{
      checkAuth();
    },
    []
  )

  useEffect(() => {
    if (activeTab === "ADD") fetchGenres();
    if (activeTab === "HISTORY") fetchHistory();

    const clearNotifications = async () => {
      try {
        await axios.put(`${url}/contribution/notifications/clear`, { userID });
      } catch (err) {
        console.log("Failed to clear notifications");
        console.log(err);
      }
    };

    if (userID) clearNotifications();
  }, [activeTab]);

  // Reset form when switching types (Word <-> Genre) to clear validation errors/values
  useEffect(() => {
    reset();
  }, [type, reset]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FILTER LOGIC ---
  const filteredRequests = myRequests.filter((req) => {
    if (statusFilter === "ALL") return true;
    return req.status === statusFilter;
  });

  // --- SUBMIT HANDLER (React Hook Form) ---
  const onSubmit = async (data) => {
    if (!userID) return toast.error("Please login first!");

    try {
      // Construct payload based on React Hook Form data
      const payload = {
        userID,
        contributionType: type,
        // Ensure we send uppercase to backend as per previous logic
        word: data.word.toLowerCase(), 
        linkedGenre: type === "word" ? data.linkedGenre : undefined,
        newGenre: type === "genre" ? data.newGenre?.toLowerCase() : undefined,
      };

      setLoading(true);

      await axios.post(`${url}/contribution/add`, payload, {
        withCredentials: true,
      });

      toast.success(
        "Contribution Submitted! PENDING Admin Approval. Will be Reviewed within 3 business days.",
        { duration: 5000 }
      );

      reset(); // Clear form inputs
      setActiveTab("HISTORY");
      setStatusFilter("ALL");
    } catch (err) {
      const msg = err.response?.data?.message || "Submission Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    setIsDropdownOpen(false);
  };

  const handlePageRefresh = () => {
    // window.location.reload();
    fetchHistory();
    window.dispatchEvent(new Event("triggerNavbarRefresh"));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="contribution-container">
      {/* HEADER */}
      <div className="contribution-header">
        <h1 className="page-title">Contribution Center</h1>
        <div className="header-spacer"></div>
      </div>

      <ContributionPromo storeSession={true} />

      {/* MAIN CARD */}
      <div className="contribution-card">
        {/* TABS */}
        <div className="tabs-header">
          <button
            onClick={() => setActiveTab("ADD")}
            className={`tab-btn ${activeTab === "ADD" ? "active" : ""}`}
          >
            <FaPlus /> Contribute
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`tab-btn ${activeTab === "HISTORY" ? "active" : ""}`}
          >
            <FaList /> My Requests
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="tab-content">
          {/* === TAB: ADD === */}
          {activeTab === "ADD" && (
            <div className="fade-in">
              <div className="type-toggle-container">
                <label
                  className={`toggle-label ${type === "word" ? "selected" : ""}`}
                >
                  <div className="radio-circle">
                    {type === "word" && <div className="inner-circle" />}
                  </div>
                  <input
                    type="radio"
                    name="type"
                    style={{ display: "none" }}
                    checked={type === "word"}
                    onChange={() => setType("word")}
                  />
                  <span>Add Word</span>
                </label>

                <label
                  className={`toggle-label ${
                    type === "genre" ? "selected" : ""
                  }`}
                >
                  <div className="radio-circle">
                    {type === "genre" && <div className="inner-circle" />}
                  </div>
                  <input
                    type="radio"
                    name="type"
                    style={{ display: "none" }}
                    checked={type === "genre"}
                    onChange={() => setType("genre")}
                  />
                  <span>Add Genre</span>
                </label>
              </div>

              {/* --- REACT HOOK FORM START --- */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {type === "word" ? (
                  <div className="form-group">
                    <label className="form-label">Select Genre</label>
                    <select
                      className={`form-select ${errors.linkedGenre ? "input-error" : ""}`}
                      {...register("linkedGenre", {
                        required: "Please select a genre",
                      })}
                    >
                      <option value="">-- Choose a Genre --</option>
                      {genres.map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    {errors.linkedGenre && (
                      <span className="error-text">
                        {errors.linkedGenre.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">
                      New Genre Name (in PLURAL)
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.newGenre ? "input-error" : ""}`}
                      placeholder="e.g. SUPERHEROES"
                      autoComplete="off"
                      style={{ textTransform: "uppercase" }} // VISUAL UPPERCASE
                      onInput={(e) => (e.target.value = e.target.value.toUpperCase())} // LOGICAL UPPERCASE
                      {...register("newGenre", {
                        required: "Genre name is required",
                        pattern: {
                          value: /^[A-Z]+$/,
                          message: "Only alphabets (A-Z) allowed",
                        },
                      })}
                    />
                    {errors.newGenre && (
                      <span className="error-text">
                        {errors.newGenre.message}
                      </span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {type === "word" ? "The Word" : "Starter Word"}
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.word ? "input-error" : ""}`}
                    placeholder="e.g. SPIDERMAN"
                    autoComplete="off"
                    style={{ textTransform: "uppercase" }} // VISUAL UPPERCASE
                    onInput={(e) => (e.target.value = e.target.value.toUpperCase())} // LOGICAL UPPERCASE
                    {...register("word", {
                      required: "Word is required",
                      pattern: {
                        value: /^[A-Z]+$/,
                        message: "Only alphabets (A-Z) allowed",
                      },
                    })}
                  />
                  {errors.word && (
                    <span className="error-text">{errors.word.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <FaGamepad /> Submit Contribution
                    </>
                  )}
                </button>
              </form>
              {/* --- REACT HOOK FORM END --- */}

              <div className="guidelines-box">
                <h3 className="guidelines-title">
                  <FaLightbulb className="text-yellow-400" /> Contribution
                  Guidelines
                </h3>
                <ul className="guidelines-list">
                  <li>
                    <span className="bullet">●</span>
                    <strong>Approval Process:</strong> Your submission will be
                    reviewed by an Admin. It will not appear in the game until
                    approved.
                  </li>
                  <li>
                    <span className="bullet">●</span>
                    <strong>Genre Format:</strong> Always use PLURAL names for
                    Genres (e.g., "ANIMALS", not "ANIMAL").
                  </li>
                  <li>
                    <span className="bullet">●</span>
                    <strong>Be Patient:</strong> We all are a community and your
                    contribution is Very Special and Important for us. If the
                    Admin comments back asking you to make some minor changes in
                    your request, kindly follow along.
                  </li>
                  <li>
                    <span className="bullet">●</span>
                    <strong>Quality Control:</strong> Ensure correct spelling.
                    Offensive or inappropriate content will be denied.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* === TAB: HISTORY === */}
          {activeTab === "HISTORY" && (
            <div className="history-container">
              {/* --- RESPONSIVE FILTER BAR --- */}
              <div className="filter-wrapper">
                {/* Desktop: Row of Buttons */}
                <div className="desktop-filters">
                  {["ALL", "PENDING", "APPROVED", "DENIED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`filter-btn ${
                        statusFilter === status ? "active" : ""
                      } ${status.toLowerCase()}`}
                    >
                      {status}
                    </button>
                  ))}

                  {/* REFRESH BUTTON (Desktop) */}
                  <button
                    onClick={handlePageRefresh}
                    className="refresh-btn"
                    title="Refresh Page"
                  >
                    <FaSync />
                  </button>
                </div>

                {/* Mobile: Custom Dropdown + Refresh */}
                <div className="mobile-filters-container" ref={dropdownRef}>
                  <div className="mobile-dropdown-wrapper">
                    <button
                      className={`dropdown-trigger ${statusFilter.toLowerCase()}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>
                        <FaFilter className="inline mr-2" /> {statusFilter}
                      </span>
                      <FaChevronDown
                        className={`transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="dropdown-menu">
                        {["ALL", "PENDING", "APPROVED", "DENIED"].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => handleFilterSelect(status)}
                              className={`dropdown-item ${
                                statusFilter === status ? "selected" : ""
                              }`}
                            >
                              {status}
                              {statusFilter === status && <FaCheck size={12} />}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* REFRESH BUTTON (Mobile) */}
                  <button
                    onClick={handlePageRefresh}
                    className="refresh-btn mobile"
                    title="Refresh Page"
                  >
                    <FaSync />
                  </button>
                </div>
              </div>

              {/* LIST */}
              <div className="history-list">
                {filteredRequests.length === 0 && (
                  <div className="empty-msg">
                    <p>
                      No{" "}
                      {statusFilter !== "ALL"
                        ? statusFilter.toLowerCase()
                        : ""}{" "}
                      contributions found.
                    </p>
                  </div>
                )}

                {filteredRequests.map((req) => (
                  <div key={req._id} className="history-item">
                    <div className="history-header">
                      {/* Left Side: Info */}
                      <div className="history-info">
                        <div className="meta-row">
                          <div className="type-badge">
                            {req.contributionType}
                          </div>
                          <div className="history-date">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <div
                              className={`status-badge ${req.status.toLowerCase()}`}
                            >
                              {req.status === "APPROVED" && (
                                <FaCheck size={10} />
                              )}
                              {req.status === "DENIED" && <FaTimes size={10} />}
                              {req.status}
                            </div>
                          </div>
                        </div>
                        <h3 className="history-word">{req.word.toUpperCase()}</h3>
                        <p className="history-genre">
                          Genre:{" "}
                          <span className="genre-highlight">
                            {req.contributionType === "genre"
                              ? req.newGenre.toUpperCase()
                              : req.linkedGenre?.name.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>

                    {req.status === "DENIED" && req.adminComment && (
                      <div className="denial-box">
                        <p className="denial-label">
                          <FaInfoCircle /> Admin Feedback:
                        </p>
                        <p>"{req.adminComment}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contribution;