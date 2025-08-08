import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Monitor, Eye, Settings, Theater } from "lucide-react";

interface Role {
  id: string;
  role: 'stage_manager' | 'operator' | 'director' | 'director_plus' | 'admin';
}

interface RoleSelectorProps {
  roles: Role[];
  onSelectRole: (role: string) => void;
  username: string;
}

const roleConfig = {
  stage_manager: {
    icon: Theater,
    title: "Stage Manager",
    description: "Control cue progression and manage operators",
    color: "bg-cue-active text-cue-active-foreground",
  },
  operator: {
    icon: User,
    title: "Operator",
    description: "View cues and manage your ready status",
    color: "bg-operator-ready text-foreground",
  },
  director: {
    icon: Eye,
    title: "Director",
    description: "Monitor show progress (read-only)",
    color: "bg-secondary text-secondary-foreground",
  },
  director_plus: {
    icon: Monitor,
    title: "Director+",
    description: "Monitor + admin access and role switching",
    color: "bg-warning text-warning-foreground",
  },
  admin: {
    icon: Settings,
    title: "Administrator",
    description: "Full system administration",
    color: "bg-primary text-primary-foreground",
  },
};

export function RoleSelector({ roles, onSelectRole, username }: RoleSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-stage">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome, {username}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Select your role for this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((userRole) => {
              const config = roleConfig[userRole.role];
              const Icon = config.icon;
              
              return (
                <Button
                  key={userRole.id}
                  variant="outline"
                  className="h-auto p-6 border-border hover:bg-accent/50 text-left flex flex-col items-start gap-3"
                  onClick={() => onSelectRole(userRole.role)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {config.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {config.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}