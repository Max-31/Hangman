import React, { useEffect, useState } from 'react';
import api from '../api';
import { FaCheck, FaTimes, FaHistory, FaInbox, FaSync } from 'react-icons/fa'; 

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('PENDING'); // Main Tab: 'PENDING' (Queue) or 'HISTORY'
  const [subFilter, setSubFilter] = useState('ALL'); // Sub-filter for specific tags
  const [comment, setComment] = useState('');
  const [selectedId, setSelectedId] = useState(null); 

  // Fetch Data
  const fetchRequests = async () => {
    try {
      // 1. If filter is PENDING (Queue), ask backend for ?status=PENDING
      // 2. If filter is HISTORY, ask backend for EVERYTHING so we can filter locally
      const query = filter === 'PENDING' ? '?status=PENDING' : '';
      
      const res = await api.get(`/contribution/admin/all${query}`);
      
      if (filter === 'HISTORY') {
        // FILTER LOGIC: Remove 'PENDING' items from History
        // History should only show Processed items (Approved/Denied)
        const historyData = res.data.filter(req => req.status !== 'PENDING');
        setRequests(historyData);
      } else {
        setRequests(res.data);
      }

    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Reset sub-filter when main tab changes 
    setSubFilter('ALL');
  }, [filter]);

  // --- FILTER LOGIC ---
  const getSubFilterOptions = () => {
    if (filter === 'PENDING') {
      return ['ALL', 'WORD', 'GENRE'];
    }
    // HISTORY TAB: Removed 'PENDING' from options
    return ['ALL', 'APPROVED', 'DENIED', 'WORD', 'GENRE'];
  };

  const visibleRequests = requests.filter(req => {
    if (subFilter === 'ALL') return true;

    // Check if subFilter matches the Contribution Type (WORD/GENRE)
    if (subFilter === 'WORD' || subFilter === 'GENRE') {
        return req.contributionType?.toUpperCase() === subFilter;
    }

    // Check if subFilter matches Status (APPROVED/DENIED)
    return req.status === subFilter;
  });

  // Handle Review Actions
  const handleReview = async (id, action) => {
    try {
      await api.put('/contribution/admin/review', {
        requestID: id,
        action: action,
        adminComment: comment
      });
      // Reset and refresh
      setComment('');
      setSelectedId(null);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action Failed');
    }
  };

  const handlePageRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-royal-dark text-gold-soft p-6 md:p-10">
      
      {/* Header */}
      <header className="flex flex-col gap-6 mb-10 border-b border-royal-light/30 pb-6">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold text-gold-vibrant tracking-tight">Game Contributions</h1>
            <p className="text-sm opacity-60 mt-1">Manage player submissions</p>
            </div>
            
            {/* Main Tabs (Queue vs History) */}
            <div className="flex bg-royal-light/20 p-1 rounded-xl h-fit">
            <button 
                onClick={() => setFilter('PENDING')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === 'PENDING' ? 'bg-gold-vibrant text-royal-dark shadow-lg' : 'hover:bg-royal-light/30'}`}
            >
                <FaInbox /> Queue
            </button>
            <button 
                onClick={() => setFilter('HISTORY')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === 'HISTORY' ? 'bg-gold-vibrant text-royal-dark shadow-lg' : 'hover:bg-royal-light/30'}`}
            >
                <FaHistory /> History
            </button>
            </div>
        </div>

        {/* --- DYNAMIC SUB-FILTERS --- */}
        <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-top-2">
        {getSubFilterOptions().map((tag) => (
            <button
                key={tag}
                onClick={() => setSubFilter(tag)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    subFilter === tag
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' // Active
                    : 'bg-[#1a1a1a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white' // Inactive
                }`}
            >
                {tag}
            </button>
        ))}

        {/* REFRESH BUTTON */}
          <button
              onClick={handlePageRefresh}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer bg-[#1a1a1a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white flex items-center justify-center"
              title="Refresh Page"
          >
              <FaSync />
          </button>

        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleRequests.length === 0 && (
          <div className="col-span-full text-center py-20 opacity-50">
            <p className="text-xl">No requests found in this category.</p>
          </div>
        )}

        {visibleRequests.map((req) => (
          <div key={req._id} className="bg-royal-light/10 border border-royal-light/20 rounded-2xl p-6 hover:border-gold-vibrant/50 transition-colors group relative overflow-hidden">
            
            {/* Status Badge (Always show in History) */}
            {filter === 'HISTORY' && (
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                req.status === 'APPROVED' ? 'bg-success/20 text-success' : 
                'bg-danger/20 text-danger'
              }`}>
                {req.status}
              </div>
            )}

            {/* Card Content */}
            <div className="mb-4">
              <span className="text-xs font-bold tracking-wider text-royal-light uppercase bg-royal-dark/50 px-2 py-1 rounded">
                {req.contributionType?.toUpperCase()}
              </span>
              <h2 className="text-2xl font-bold text-white mt-3 mb-1">
                  {req.word?.toUpperCase() || 'UNKNOWN WORD'}
              </h2>
              <p className="text-sm opacity-70">
                Genre: <span className="text-gold-vibrant">
                    {req.contributionType === 'genre' 
                        ? (req.newGenre?.toUpperCase() || 'N/A') 
                        : (req.linkedGenre?.name?.toUpperCase() || 'UNKNOWN')}
                </span>
              </p>
            </div>

            <div className="text-xs opacity-50 mb-6 flex justify-between">
              <span>By: {req.userID?.userName || 'Unknown'}</span>
              <span>{new Date(req.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Actions (Only show for PENDING status in Queue) */}
            {req.status === 'PENDING' && (
              <div className="space-y-3">
                {/* Denial Input */}
                {selectedId === req._id ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <input 
                      type="text" 
                      placeholder="Reason for rejection..." 
                      className="w-full bg-royal-dark/80 border border-danger/30 rounded-lg px-3 py-2 text-sm focus:border-danger outline-none mb-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReview(req._id, 'DENIED')}
                        className="flex-1 bg-danger hover:bg-danger/90 text-white text-sm py-2 rounded-lg font-medium cursor-pointer"
                      >
                        Confirm Deny
                      </button>
                      <button 
                        onClick={() => setSelectedId(null)}
                        className="bg-gray-600/50 hover:bg-gray-600 text-white px-3 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Default Buttons
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleReview(req._id, 'APPROVED')}
                      className="flex-1 bg-success/10 hover:bg-success hover:text-white text-success border border-success/30 hover:border-transparent py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button 
                      onClick={() => setSelectedId(req._id)}
                      className="flex-1 bg-danger/10 hover:bg-danger hover:text-white text-danger border border-danger/30 hover:border-transparent py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaTimes /> Deny
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Show Admin Comment if processed */}
            {req.status !== 'PENDING' && req.adminComment && (
              <div className="mt-4 p-3 bg-royal-dark/40 rounded-lg text-xs italic opacity-70">
                " {req.adminComment} "
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import { FaCheck, FaTimes, FaHistory, FaInbox, FaSync } from 'react-icons/fa'; 

// const Dashboard = () => {
//   const [requests, setRequests] = useState([]);
//   const [filter, setFilter] = useState('PENDING'); // Main Tab: 'PENDING' (Queue) or 'HISTORY'
//   const [subFilter, setSubFilter] = useState('ALL'); // Sub-filter for specific tags
//   const [comment, setComment] = useState('');
//   const [selectedId, setSelectedId] = useState(null); 

//   // Fetch Data
//   const fetchRequests = async () => {
//     try {
//       // 1. If filter is PENDING (Queue), ask backend for ?status=PENDING
//       // 2. If filter is HISTORY, ask backend for EVERYTHING so we can filter locally
//       const query = filter === 'PENDING' ? '?status=PENDING' : '';
      
//       const res = await api.get(`/contribution/admin/all${query}`);
      
//       if (filter === 'HISTORY') {
//         // FILTER LOGIC: Remove 'PENDING' items from History
//         // History should only show Processed items (Approved/Denied)
//         const historyData = res.data.filter(req => req.status !== 'PENDING');
//         setRequests(historyData);
//       } else {
//         setRequests(res.data);
//       }

//     } catch (err) {
//       console.error("Failed to fetch requests", err);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//     // Reset sub-filter when main tab changes 
//     setSubFilter('ALL');
//   }, [filter]);

//   // --- FILTER LOGIC ---
//   const getSubFilterOptions = () => {
//     if (filter === 'PENDING') {
//       return ['ALL', 'WORD', 'GENRE'];
//     }
//     // HISTORY TAB: Removed 'PENDING' from options
//     return ['ALL', 'APPROVED', 'DENIED', 'WORD', 'GENRE'];
//   };

//   const visibleRequests = requests.filter(req => {
//     if (subFilter === 'ALL') return true;

//     // Check if subFilter matches the Contribution Type (WORD/GENRE)
//     if (subFilter === 'WORD' || subFilter === 'GENRE') {
//         return req.contributionType?.toUpperCase() === subFilter;
//     }

//     // Check if subFilter matches Status (APPROVED/DENIED)
//     return req.status === subFilter;
//   });

//   // Handle Review Actions
//   const handleReview = async (id, action) => {
//     try {
//       await api.put('/contribution/admin/review', {
//         requestID: id,
//         action: action,
//         adminComment: comment
//       });
//       // Reset and refresh
//       setComment('');
//       setSelectedId(null);
//       fetchRequests();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Action Failed');
//     }
//   };

//   const handlePageRefresh = () => {
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-royal-dark text-gold-soft p-6 md:p-10">
      
//       {/* Header */}
//       <header className="flex flex-col gap-6 mb-10 border-b border-royal-light/30 pb-6">
//         <div className="flex justify-between items-center">
//             <div>
//             <h1 className="text-3xl font-bold text-gold-vibrant tracking-tight">Game Contributions</h1>
//             <p className="text-sm opacity-60 mt-1">Manage player submissions</p>
//             </div>
            
//             {/* Main Tabs (Queue vs History) */}
//             <div className="flex bg-royal-light/20 p-1 rounded-xl h-fit">
//             <button 
//                 onClick={() => setFilter('PENDING')}
//                 className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === 'PENDING' ? 'bg-gold-vibrant text-royal-dark shadow-lg' : 'hover:bg-royal-light/30'}`}
//             >
//                 <FaInbox /> Queue
//             </button>
//             <button 
//                 onClick={() => setFilter('HISTORY')}
//                 className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === 'HISTORY' ? 'bg-gold-vibrant text-royal-dark shadow-lg' : 'hover:bg-royal-light/30'}`}
//             >
//                 <FaHistory /> History
//             </button>
//             </div>
//         </div>

//         {/* --- DYNAMIC SUB-FILTERS --- */}
//         <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-top-2">
//         {getSubFilterOptions().map((tag) => (
//             <button
//                 key={tag}
//                 onClick={() => setSubFilter(tag)}
//                 className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
//                     subFilter === tag
//                     ? 'bg-blue-600 text-white border-blue-600 shadow-lg' // Active
//                     : 'bg-[#1a1a1a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white' // Inactive
//                 }`}
//             >
//                 {tag}
//             </button>
//         ))}

//         {/* REFRESH BUTTON */}
//           <button
//               onClick={handlePageRefresh}
//               className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer bg-[#1a1a1a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white flex items-center justify-center"
//               title="Refresh Page"
//           >
//               <FaSync />
//           </button>

//         </div>
//       </header>

//       {/* Grid Content */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {visibleRequests.length === 0 && (
//           <div className="col-span-full text-center py-20 opacity-50">
//             <p className="text-xl">No requests found in this category.</p>
//           </div>
//         )}

//         {visibleRequests.map((req) => (
//           <div key={req._id} className="bg-royal-light/10 border border-royal-light/20 rounded-2xl p-6 hover:border-gold-vibrant/50 transition-colors group relative overflow-hidden">
            
//             {/* Status Badge (Always show in History) */}
//             {filter === 'HISTORY' && (
//               <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
//                 req.status === 'APPROVED' ? 'bg-success/20 text-success' : 
//                 'bg-danger/20 text-danger'
//               }`}>
//                 {req.status}
//               </div>
//             )}

//             {/* Card Content */}
//             <div className="mb-4">
//               <span className="text-xs font-bold tracking-wider text-royal-light uppercase bg-royal-dark/50 px-2 py-1 rounded">
//                 {req.contributionType}
//               </span>
//               <h2 className="text-2xl font-bold text-white mt-3 mb-1">{req.word.toUpperCase()}</h2>
//               <p className="text-sm opacity-70">
//                 Genre: <span className="text-gold-vibrant">{req.contributionType === 'genre' ? req.newGenre.toUpperCase() : req.linkedGenre?.name.toUpperCase()}</span>
//               </p>
//             </div>

//             <div className="text-xs opacity-50 mb-6 flex justify-between">
//               <span>By: {req.userID?.userName || 'Unknown'}</span>
//               <span>{new Date(req.createdAt).toLocaleDateString()}</span>
//             </div>

//             {/* Actions (Only show for PENDING status in Queue) */}
//             {req.status === 'PENDING' && (
//               <div className="space-y-3">
//                 {/* Denial Input */}
//                 {selectedId === req._id ? (
//                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
//                     <input 
//                       type="text" 
//                       placeholder="Reason for rejection..." 
//                       className="w-full bg-royal-dark/80 border border-danger/30 rounded-lg px-3 py-2 text-sm focus:border-danger outline-none mb-2"
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       autoFocus
//                     />
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => handleReview(req._id, 'DENIED')}
//                         className="flex-1 bg-danger hover:bg-danger/90 text-white text-sm py-2 rounded-lg font-medium cursor-pointer"
//                       >
//                         Confirm Deny
//                       </button>
//                       <button 
//                         onClick={() => setSelectedId(null)}
//                         className="bg-gray-600/50 hover:bg-gray-600 text-white px-3 rounded-lg cursor-pointer"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // Default Buttons
//                   <div className="flex gap-3">
//                     <button 
//                       onClick={() => handleReview(req._id, 'APPROVED')}
//                       className="flex-1 bg-success/10 hover:bg-success hover:text-white text-success border border-success/30 hover:border-transparent py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
//                     >
//                       <FaCheck /> Approve
//                     </button>
//                     <button 
//                       onClick={() => setSelectedId(req._id)}
//                       className="flex-1 bg-danger/10 hover:bg-danger hover:text-white text-danger border border-danger/30 hover:border-transparent py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
//                     >
//                       <FaTimes /> Deny
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Show Admin Comment if processed */}
//             {req.status !== 'PENDING' && req.adminComment && (
//               <div className="mt-4 p-3 bg-royal-dark/40 rounded-lg text-xs italic opacity-70">
//                 " {req.adminComment} "
//               </div>
//             )}

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;