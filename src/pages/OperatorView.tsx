import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { 
  CheckCircle, 
  AlertTriangle, 
  Moon, 
  VolumeX, 
  MessageSquare,
  FileText,
  LogOut,
  Circle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function OperatorView() {
  const [currentCue, setCurrentCue] = useState(3);
  const [cueStatus, setCueStatus] = useState<'waiting' | 'standby' | 'go'>('standby');
  const [isReady, setIsReady] = useState(true);
  const [privateNotes, setPrivateNotes] = useState('Ready to follow actor movement');
  const [silentMode, setSilentMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const cues = [
    { id: 1, number: "1", department: "Lighting", description: "House lights fade", notes: "Slow 5 count", myDept: false },
    { id: 2, number: "2", department: "Sound", description: "Preshow music fade", notes: "Cross fade to silence", myDept: false },
    { id: 3, number: "3", department: "Lighting", description: "Stage wash up", notes: "Quick snap", myDept: false },
    { id: 4, number: "4", department: "Spot", description: "Follow spot on actor center", notes: "Track movement to DSR", myDept: true },
    { id: 5, number: "5", department: "Sound", description: "Thunder sound effect", notes: "Build slowly", myDept: false },
    { id: 6, number: "6", department: "Spot", description: "Spot fade out", notes: "Slow fade", myDept: true },
  ];

  const myCues = cues.filter(cue => cue.myDept);
  const currentCueData = cues.find((_, index) => index + 1 === currentCue);
  const isMyCurrentCue = currentCueData?.myDept || false;

  const handleReadyToggle = () => {
    setIsReady(!isReady);
    toast({
      title: isReady ? "Marked Not Ready" : "Marked Ready",
      description: "Status sent to Stage Manager",
    });
  };

  const handleEmergencyPing = () => {
    toast({
      title: "Emergency Ping Sent",
      description: "Silent alert sent to Stage Manager",
      variant: "destructive",
    });
  };

  const handleNotesUpdate = () => {
    toast({
      title: "Notes Updated",
      description: "Private notes saved and shared with Stage Manager",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operator Console</h1>
            <p className="text-muted-foreground">Department: Spotlight • Show: Hamlet Act 1</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant={isReady ? "default" : "outline"}
              onClick={handleReadyToggle}
              className={isReady ? "bg-operator-ready hover:bg-operator-ready/90" : ""}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isReady ? "Ready" : "Not Ready"}
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Cue Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Cue */}
            <Card className={`bg-card border-2 ${
              isMyCurrentCue 
                ? 'border-cue-active shadow-cue' 
                : 'border-border'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Current Cue
                  <StatusIndicator status={cueStatus} size="lg" />
                  {isMyCurrentCue && (
                    <Badge className="bg-cue-active text-cue-active-foreground">
                      YOUR CUE
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-cue-active">
                    {currentCue}
                  </div>
                  {currentCueData && (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {currentCueData.department}
                      </Badge>
                      <p className="text-xl text-foreground">
                        {currentCueData.description}
                      </p>
                      <p className="text-muted-foreground">
                        {currentCueData.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Status Display */}
                  <div className="pt-4">
                    {cueStatus === 'standby' && (
                      <div className="text-2xl font-bold text-standby animate-standby-pulse">
                        STANDBY
                      </div>
                    )}
                    {cueStatus === 'go' && (
                      <div className="text-2xl font-bold text-go">
                        GO
                      </div>
                    )}
                    {cueStatus === 'waiting' && (
                      <div className="text-xl text-muted-foreground">
                        Waiting...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Cues List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>My Upcoming Cues</CardTitle>
                <CardDescription>Spotlight department cues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {myCues.map((cue, index) => (
                    <div
                      key={cue.id}
                      className={`p-3 rounded-md border ${
                        cue.number === currentCueData?.number
                          ? 'bg-cue-active/20 border-cue-active'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-cue-active min-w-8">
                          {cue.number}
                        </div>
                        <div className="flex-1 text-foreground">{cue.description}</div>
                        {cue.number === currentCueData?.number && (
                          <Circle className="w-4 h-4 text-cue-active fill-current" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 ml-11">
                        {cue.notes}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Cue List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Cues</CardTitle>
                <CardDescription>Complete show sequence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {cues.map((cue, index) => (
                    <div
                      key={cue.id}
                      className={`p-2 rounded-md flex items-center gap-3 ${
                        index + 1 === currentCue
                          ? 'bg-cue-active/20 border border-cue-active'
                          : cue.myDept 
                          ? 'bg-accent/50'
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="font-mono font-bold text-sm min-w-8">
                        {cue.number}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cue.myDept ? "border-cue-active" : ""}
                      >
                        {cue.department}
                      </Badge>
                      <div className="flex-1 text-sm text-foreground truncate">
                        {cue.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Emergency Controls */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emergency">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleEmergencyPing}
                  variant="destructive"
                  className="w-full"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Silent Emergency Ping
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="silent-mode" className="flex items-center gap-2">
                      <VolumeX className="w-4 h-4" />
                      Silent Mode
                    </Label>
                    <Switch
                      id="silent-mode"
                      checked={silentMode}
                      onCheckedChange={setSilentMode}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </Label>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Private Notes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Cue Notes
                </CardTitle>
                <CardDescription>
                  Notes for cue {currentCue} (shared with Stage Manager)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add notes for this cue..."
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    className="bg-input border-border min-h-24"
                  />
                  <Button 
                    onClick={handleNotesUpdate}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No new announcements
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}