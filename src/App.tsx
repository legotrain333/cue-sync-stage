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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    roles: Array<{
      id: string;
      role: 'stage_manager' | 'operator' | 'director' | 'director_plus' | 'admin';
    }>;
  } | null;
  selectedRole: string | null;
}

const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    selectedRole: null,
  });

  const handleLogin = async (username: string, password: string) => {
    // Mock authentication - replace with real Supabase auth
    if (username && password) {
      const mockUser = {
        id: '1',
        username,
        roles: [
          { id: '1', role: 'stage_manager' as const },
          { id: '2', role: 'operator' as const },
          { id: '3', role: 'director' as const },
        ],
      };
      
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        selectedRole: mockUser.roles.length === 1 ? mockUser.roles[0].role : null,
      });
    }
  };

  const handleRoleSelect = (role: string) => {
    setAuthState(prev => ({
      ...prev,
      selectedRole: role,
    }));
  };

  const renderDashboard = () => {
    switch (authState.selectedRole) {
      case 'stage_manager':
        return <StageManagerDashboard />;
      case 'operator':
        return <OperatorView />;
      case 'director':
      case 'director_plus':
        return <DirectorView />;
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
                  <LoginForm onLogin={handleLogin} />
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