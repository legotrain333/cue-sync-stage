import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { 
  Clock, 
  Users, 
  Eye, 
  MessageSquare,
  Monitor,
  LogOut
} from "lucide-react";

export function DirectorView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartTime] = useState(new Date(Date.now() - 45 * 60 * 1000)); // Started 45 minutes ago

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for demonstration
  const currentCue = 4;
  const totalCues = 25;
  const showDuration = Math.floor((currentTime.getTime() - showStartTime.getTime()) / 1000);
  const hours = Math.floor(showDuration / 3600);
  const minutes = Math.floor((showDuration % 3600) / 60);
  const seconds = showDuration % 60;

  const operators = [
    { 
      id: 1, 
      name: "Alex", 
      department: "Lighting", 
      currentCue: 4, 
      ready: true, 
      online: true,
      lastActivity: "30s ago"
    },
    { 
      id: 2, 
      name: "Jamie", 
      department: "Sound", 
      currentCue: 4, 
      ready: false, 
      online: true,
      lastActivity: "2m ago"
    },
    { 
      id: 3, 
      name: "Sam", 
      department: "Spotlight", 
      currentCue: 4, 
      ready: true, 
      online: true,
      lastActivity: "1m ago"
    },
    { 
      id: 4, 
      name: "Chris", 
      department: "Backstage", 
      currentCue: 3, 
      ready: true, 
      online: false,
      lastActivity: "15m ago"
    },
  ];

  const recentCues = [
    { number: "1", department: "Lighting", description: "House lights fade", timestamp: "19:32:15", status: "complete" },
    { number: "2", department: "Sound", description: "Preshow music fade", timestamp: "19:33:02", status: "complete" },
    { number: "3", department: "Lighting", description: "Stage wash up", timestamp: "19:33:45", status: "complete" },
    { number: "4", department: "Spotlight", description: "Follow spot center", timestamp: "19:45:22", status: "active" },
  ];

  const announcements = [
    { id: 1, message: "Act 1 beginning in 5 minutes", time: "19:27:00", sender: "Stage Manager" },
    { id: 2, message: "All departments ready for sequence", time: "19:30:15", sender: "Stage Manager" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Director Monitor</h1>
            <p className="text-muted-foreground">Show: Hamlet Act 1 • Read-only view</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Monitor className="w-4 h-4 mr-2" />
              Switch Role
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Show Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Show Clock and Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Show Clock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-cue-active">
                      {String(hours).padStart(2, '0')}:
                      {String(minutes).padStart(2, '0')}:
                      {String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-muted-foreground">
                      Started at {showStartTime.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Show Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-cue-active">
                      {currentCue} / {totalCues}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-cue-active h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentCue / totalCues) * 100}%` }}
                      />
                    </div>
                    <div className="text-muted-foreground">
                      {Math.round((currentCue / totalCues) * 100)}% Complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Cue Display */}
            <Card className="bg-card border-cue-active border-2 shadow-cue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Current Cue Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-cue-active">
                    {currentCue}
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Spotlight
                    </Badge>
                    <p className="text-xl text-foreground">
                      Follow spot on actor center stage
                    </p>
                    <p className="text-muted-foreground">
                      Track movement to downstage right
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <StatusIndicator status="standby" size="lg" />
                    <span className="text-lg font-medium text-standby">STANDBY</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Cue History */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Cue Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recentCues.map((cue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border flex items-center gap-3 ${
                        cue.status === 'active'
                          ? 'bg-cue-active/20 border-cue-active'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="font-bold text-cue-active min-w-8">
                        {cue.number}
                      </div>
                      <Badge variant="outline">{cue.department}</Badge>
                      <div className="flex-1 text-foreground">{cue.description}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {cue.timestamp}
                      </div>
                      <StatusIndicator 
                        status={cue.status === 'active' ? 'standby' : 'complete'} 
                        size="sm" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Operator Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Operator Status
                </CardTitle>
                <CardDescription>
                  Live status of all operators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {operators.map((operator) => (
                    <div key={operator.id} className="p-3 rounded-md bg-muted/50 space-y-2">
                      <div className="flex items-center gap-3">
                        <StatusIndicator 
                          status={operator.online ? (operator.ready ? 'ready' : 'not-ready') : 'waiting'} 
                          size="md" 
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{operator.name}</div>
                          <div className="text-sm text-muted-foreground">{operator.department}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono text-cue-active">
                            Cue {operator.currentCue}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {operator.lastActivity}
                          </div>
                        </div>
                      </div>
                      {!operator.online && (
                        <div className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                          Offline
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Stage Manager</span>
                    <StatusIndicator status="ready" size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Show Active</span>
                    <StatusIndicator status="go" size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Operators Online</span>
                    <span className="text-sm font-medium text-operator-ready">
                      {operators.filter(op => op.online).length}/{operators.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Ready Status</span>
                    <span className="text-sm font-medium text-operator-ready">
                      {operators.filter(op => op.ready && op.online).length}/{operators.filter(op => op.online).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-2 rounded-md bg-muted/30">
                      <div className="text-sm text-foreground">{announcement.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {announcement.time} • {announcement.sender}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}