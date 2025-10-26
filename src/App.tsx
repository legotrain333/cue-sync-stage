import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { SessionSelector } from "@/components/auth/SessionSelector";
import { SessionRoleSelector } from "@/components/auth/SessionRoleSelector";
import { StageManagerDashboard } from "@/pages/StageManagerDashboard";
import { OperatorView } from "@/pages/OperatorView";
import { DirectorView } from "@/pages/DirectorView";
import { AdminPanel } from "@/pages/AdminPanel";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleSessionJoined = (joinedSessionId: string, role: string) => {
    setSessionId(joinedSessionId);
    if (role) {
      setSelectedRole(role);
    } else {
      setNeedsRoleSelection(true);
    }
  };

  const handleRoleSelected = (role: string) => {
    setSelectedRole(role);
    setNeedsRoleSelection(false);
  };

  const handleRoleSwitch = () => {
    setSelectedRole(null);
    setSessionId(null);
    setNeedsRoleSelection(false);
  };

  const handleLogout = async () => {
    await signOut();
    setSelectedRole(null);
    setSessionId(null);
    setNeedsRoleSelection(false);
  };

  const renderDashboard = () => {
    if (!profile || !selectedRole) return null;

    const commonProps = {
      user: profile,
      onLogout: handleLogout,
    };

    switch (selectedRole) {
      case "stage_manager":
        return <StageManagerDashboard {...commonProps} />;
      case "operator":
        return <OperatorView {...commonProps} />;
      case "director":
      case "director_plus":
        return <DirectorView {...commonProps} />;
      case "admin":
        return <AdminPanel {...commonProps} onSwitchRole={handleRoleSwitch} />;
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LoginForm onLoginSuccess={() => {}} />
                ) : selectedRole ? (
                  renderDashboard()
                ) : needsRoleSelection && sessionId ? (
                  <SessionRoleSelector
                    sessionId={sessionId}
                    onRoleSelected={handleRoleSelected}
                  />
                ) : (
                  <SessionSelector
                    username={profile?.username || ""}
                    onSessionJoined={handleSessionJoined}
                  />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;