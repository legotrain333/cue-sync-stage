import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Lightbulb, Video, Shield } from "lucide-react";

interface SessionRoleSelectorProps {
  sessionId: string;
  availableRoles: Array<{ id: string; role: string }>;
  onRoleSelected: (role: string) => void;
}

const roleConfig: Record<string, { icon: any; title: string; description: string; color: string }> = {
  stage_manager: {
    icon: Shield,
    title: "Stage Manager",
    description: "Control cues and manage the show",
    color: "from-blue-500 to-blue-600",
  },
  operator: {
    icon: Lightbulb,
    title: "Operator",
    description: "Follow cues and update status",
    color: "from-green-500 to-green-600",
  },
  director: {
    icon: Video,
    title: "Director",
    description: "Monitor the performance",
    color: "from-purple-500 to-purple-600",
  },
  director_plus: {
    icon: Video,
    title: "Director Plus",
    description: "Enhanced director capabilities",
    color: "from-purple-600 to-purple-700",
  },
  admin: {
    icon: Users,
    title: "Administrator",
    description: "Full system access",
    color: "from-red-500 to-red-600",
  },
};

export const SessionRoleSelector = ({ sessionId, availableRoles, onRoleSelected }: SessionRoleSelectorProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleSelect = async (role: string) => {
    setLoading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;

      if (!userId) throw new Error("User not authenticated");

      // Add user to session with selected role
      const { error } = await supabase
        .from("session_participants")
        .insert({
          session_id: sessionId,
          user_id: userId,
          role: role as "admin" | "director" | "director_plus" | "operator" | "stage_manager",
        });

      if (error) throw error;

      onRoleSelected(role);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Select Your Role</CardTitle>
          <CardDescription>Choose how you'll participate in this session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRoles.map((userRole) => {
              const config = roleConfig[userRole.role];
              const Icon = config.icon;
              
              return (
                <Button
                  key={userRole.id}
                  onClick={() => handleRoleSelect(userRole.role)}
                  disabled={loading}
                  className="h-32 flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
                  variant="outline"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <Icon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">{config.title}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
