import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { StageManagerDashboard } from "@/pages/StageManagerDashboard";
import { OperatorView } from "@/pages/OperatorView";
import { DirectorView } from "@/pages/DirectorView";
import { AdminPanel } from "@/pages/AdminPanel";
import { mockAuth } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/database";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  selectedRole: string | null;
  isLoading: boolean;
  error: string | null;
}

const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    selectedRole: null,
    isLoading: false,
    error: null,
  });

  const handleLogin = async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await mockAuth.signIn(username, password);
      
      if (user) {
        const formattedUser: User = {
          id: user.id,
          username: user.username,
          email: `${user.username}@theater.local`,
          roles: user.roles.map(role => ({
            ...role,
            user_id: user.id,
            created_at: new Date().toISOString(),
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setAuthState({
          isAuthenticated: true,
          user: formattedUser,
          selectedRole: formattedUser.roles.length === 1 ? formattedUser.roles[0].role : null,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Invalid username or password' 
        }));
      }
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Login failed. Please try again.' 
      }));
    }
  };

  const handleLogout = async () => {
    await mockAuth.signOut();
    setAuthState({
      isAuthenticated: false,
      user: null,
      selectedRole: null,
      isLoading: false,
      error: null,
    });
  };

  const handleRoleSelect = (role: string) => {
    setAuthState(prev => ({
      ...prev,
      selectedRole: role,
    }));
  };

  const handleRoleSwitch = (newRole: string) => {
    setAuthState(prev => ({ ...prev, selectedRole: newRole }));
  };

  const renderDashboard = () => {
    switch (authState.selectedRole) {
      case 'stage_manager':
        return <StageManagerDashboard onLogout={handleLogout} />;
      case 'operator':
        return <OperatorView onLogout={handleLogout} />;
      case 'director':
        return <DirectorView onLogout={handleLogout} />;
      case 'director_plus':
      case 'admin':
        return <AdminPanel onLogout={handleLogout} onSwitchRole={handleRoleSwitch} />;
      default:
        return <NotFound />;
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
                !authState.isAuthenticated ? (
                  <LoginForm 
                    onLogin={handleLogin} 
                    isLoading={authState.isLoading}
                    error={authState.error}
                  />
                ) : !authState.selectedRole && authState.user ? (
                  <RoleSelector 
                    roles={authState.user.roles}
                    onSelectRole={handleRoleSelect}
                    username={authState.user.username}
                  />
                ) : (
                  renderDashboard()
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