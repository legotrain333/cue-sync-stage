import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Settings, 
  Users, 
  Shield,
  LogOut,
  Monitor,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export function AdminPanel({ onLogout, onSwitchRole }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock user data
  const users = [
    { 
      id: 1, 
      username: "stagemanager", 
      email: "sm@theater.local", 
      roles: ["Stage Manager"], 
      lastLogin: "2024-01-08 19:30:15",
      status: "online"
    },
    { 
      id: 2, 
      username: "operator1", 
      email: "op1@theater.local", 
      roles: ["Operator"], 
      lastLogin: "2024-01-08 19:25:00",
      status: "online"
    },
    { 
      id: 3, 
      username: "director", 
      email: "dir@theater.local", 
      roles: ["Director"], 
      lastLogin: "2024-01-08 19:20:30",
      status: "online"
    },
    { 
      id: 4, 
      username: "admin", 
      email: "admin@theater.local", 
      roles: ["Stage Manager", "Director+", "Admin"], 
      lastLogin: "2024-01-08 18:45:12",
      status: "offline"
    },
  ];

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "User creation dialog would open here",
    });
  };

  const handleEditUser = (userId: number) => {
    toast({
      title: "Edit User",
      description: `Edit dialog for user ${userId} would open here`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "Delete User",
      description: `Confirmation dialog for deleting user ${userId} would open here`,
      variant: "destructive",
    });
  };

  const availableRoles = [
    { name: "Stage Manager", color: "bg-cue-active" },
    { name: "Operator", color: "bg-operator-ready" },
    { name: "Director", color: "bg-secondary" },
    { name: "Director+", color: "bg-warning" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
            <p className="text-muted-foreground">User management and system settings</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => onSwitchRole('director')}>
              <Monitor className="w-4 h-4 mr-2" />
              Switch to Director
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter(u => u.status === 'online').length} online
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {users.filter(u => u.status === 'online').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently logged in
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stage Managers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {users.filter(u => u.roles.includes('Stage Manager')).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Can control cues
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {users.filter(u => u.roles.includes('Operator')).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Department staff
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their role assignments</CardDescription>
              </div>
              <Button onClick={handleAddUser} className="bg-cue-active hover:bg-cue-active/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-foreground">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'online' ? 'default' : 'secondary'}
                        className={user.status === 'online' ? 'bg-operator-ready' : ''}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role Overview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Role Overview</CardTitle>
            <CardDescription>Available roles and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRoles.map((role, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <div className="font-medium text-foreground">{role.name}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role.name === "Stage Manager" && "Full cue control and operator management"}
                    {role.name === "Operator" && "View cues and manage ready status"}
                    {role.name === "Director" && "Read-only show monitoring"}
                    {role.name === "Director+" && "Director access plus admin capabilities"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}