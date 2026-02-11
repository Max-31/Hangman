import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element:
        <div>
          <Login />
        </div>
    },
    {
      path: '/dashboard',
      element:
        <div>
          <Dashboard />
        </div>
    },
    {
      path: '*',
      element: 
        <div>
          <Navigate to="/login" replace />
        </div>
    }
  ]
)

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
      <Toaster position='top-center' reverseOrder={false}/>
    </div>

    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/dashboard" element={<Dashboard />} />
    //     {/* Redirect root to login for now */}
    //     <Route path="*" element={<Navigate to="/login" replace />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;