import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { 
  Upload, 
  Play, 
  SkipBack, 
  SkipForward, 
  AlertTriangle, 
  RotateCcw, 
  Users, 
  MessageSquare,
  FileText,
  Settings,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StageManagerDashboardProps {
  onLogout: () => void;
}

export function StageManagerDashboard({ onLogout }: StageManagerDashboardProps) {
  const [currentCue, setCurrentCue] = useState(1);
  const [cueStatus, setCueStatus] = useState<'waiting' | 'standby' | 'go'>('waiting');
  const [announcement, setAnnouncement] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  const cues = [
    { id: 1, number: "1", department: "Lighting", description: "House lights fade", notes: "Slow 5 count" },
    { id: 2, number: "2", department: "Sound", description: "Preshow music fade", notes: "Cross fade to silence" },
    { id: 3, number: "3", department: "Lighting", description: "Stage wash up", notes: "Quick snap" },
    { id: 4, number: "4", department: "Spot", description: "Follow spot on actor center", notes: "Track movement to DSR" },
  ];

  const operators = [
    { id: 1, name: "Alex (Lighting)", ready: true, notes: "Standing by", online: true },
    { id: 2, name: "Jamie (Sound)", ready: false, notes: "Checking levels", online: true },
    { id: 3, name: "Sam (Spot)", ready: true, notes: "Ready to follow", online: false },
  ];

  const handleStandby = () => {
    setCueStatus('standby');
    toast({
      title: "Standby Called",
      description: `Cue ${currentCue} is on standby`,
    });
  };

  const handleGo = () => {
    setCueStatus('go');
    setTimeout(() => {
      setCueStatus('waiting');
    }, 1000);
    toast({
      title: "Go Called",
      description: `Cue ${currentCue} executed`,
    });
  };

  const handleNext = () => {
    if (currentCue < cues.length) {
      setCurrentCue(prev => prev + 1);
      setCueStatus('waiting');
    }
  };

  const handlePrevious = () => {
    if (currentCue > 1) {
      setCurrentCue(prev => prev - 1);
      setCueStatus('waiting');
    }
  };

  const handleUndo = () => {
    if (currentCue > 1) {
      setCurrentCue(prev => prev - 1);
      setCueStatus('waiting');
      toast({
        title: "Cue Undone",
        description: `Returned to cue ${currentCue - 1}`,
      });
    }
  };

  const handleReset = () => {
    setCurrentCue(1);
    setCueStatus('waiting');
    toast({
      title: "Show Reset",
      description: "Returned to cue 1",
    });
  };

  const sendAnnouncement = () => {
    if (announcement.trim()) {
      toast({
        title: "Announcement Sent",
        description: announcement,
      });
      setAnnouncement('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stage Manager Console</h1>
            <p className="text-muted-foreground">Show: Hamlet Act 1</p>
          </div>
          <div className="flex items-center gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Cue Control */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cue Display */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Current Cue
                  <StatusIndicator status={cueStatus} size="lg" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-cue-active">
                    {currentCue}
                  </div>
                  {cues[currentCue - 1] && (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {cues[currentCue - 1].department}
                      </Badge>
                      <p className="text-xl text-foreground">
                        {cues[currentCue - 1].description}
                      </p>
                      <p className="text-muted-foreground">
                        {cues[currentCue - 1].notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Control Buttons */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Cue Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={handleStandby}
                    className="h-16 bg-standby hover:bg-standby/90 text-standby-foreground font-bold text-lg"
                    disabled={cueStatus === 'standby'}
                  >
                    STANDBY
                  </Button>
                  <Button 
                    onClick={handleGo}
                    className="h-16 bg-go hover:bg-go/90 text-go-foreground font-bold text-lg"
                    disabled={cueStatus !== 'standby'}
                  >
                    GO
                  </Button>
                  <Button 
                    onClick={handlePrevious}
                    variant="outline"
                    className="h-16"
                    disabled={currentCue <= 1}
                  >
                    <SkipBack className="w-6 h-6 mr-2" />
                    BACK
                  </Button>
                  <Button 
                    onClick={handleNext}
                    variant="outline"
                    className="h-16"
                    disabled={currentCue >= cues.length}
                  >
                    <SkipForward className="w-6 h-6 mr-2" />
                    NEXT
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleUndo}
                    variant="outline"
                    className="text-warning"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Undo Last
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="text-destructive"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Show
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cue List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Cue List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cues.map((cue, index) => (
                    <div
                      key={cue.id}
                      className={`p-3 rounded-md border ${
                        index + 1 === currentCue
                          ? 'bg-cue-active/20 border-cue-active'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-cue-active min-w-8">
                          {cue.number}
                        </div>
                        <Badge variant="outline">{cue.department}</Badge>
                        <div className="flex-1 text-foreground">{cue.description}</div>
                      </div>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {operators.map((operator) => (
                    <div key={operator.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                      <StatusIndicator 
                        status={operator.online ? (operator.ready ? 'ready' : 'not-ready') : 'waiting'} 
                        size="md" 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{operator.name}</div>
                        <div className="text-sm text-muted-foreground">{operator.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Global Announcements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Send announcement to all operators..."
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="bg-input border-border"
                  />
                  <Button 
                    onClick={sendAnnouncement}
                    className="w-full"
                    disabled={!announcement.trim()}
                  >
                    Send Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Private Notes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Private Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Your private notes..."
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  className="bg-input border-border min-h-24"
                />
              </CardContent>
            </Card>

            {/* File Management */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Cue Sheets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Sheet
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Current: hamlet_act1.csv
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}