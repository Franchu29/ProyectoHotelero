import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import RequestGeneral from "./pages/request-general";
import WorkersDirectory from "./pages/WorkersDirectory";
import CreateRequest from "./pages/CreateRequest";
import CreateWorker from "./pages/CreateWorker";
import EditWorker from "./pages/EditWorker";
import RequestView from "./pages/RequestView";
import Help from "./pages/Help";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* PROTEGIDAS */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/request-detail"
            element={
              <ProtectedRoute>
                <RequestGeneral />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workersdirectory"
            element={
              <ProtectedRoute>
                <WorkersDirectory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-request"
            element={
              <ProtectedRoute>
                <CreateRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workers/new"
            element={
              <ProtectedRoute>
                <CreateWorker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workers/:id/edit"
            element={
              <ProtectedRoute>
                <EditWorker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
