import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SessionSelectorProps {
  username: string;
  hasStageManagerRole: boolean;
  onSessionJoined: (sessionId: string, role: string) => void;
}

export const SessionSelector = ({ username, hasStageManagerRole, onSessionJoined }: SessionSelectorProps) => {
  const [mode, setMode] = useState<"select" | "start" | "join">("select");
  const [loading, setLoading] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [createdCode, setCreatedCode] = useState("");
  const { toast } = useToast();

  const handleStartSession = async () => {
    if (!sessionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate session code
      const { data: codeData, error: codeError } = await supabase.rpc('generate_session_code');
      
      if (codeError) throw codeError;

      // Create session
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          name: sessionName,
          session_code: codeData,
          password: usePassword ? password : null,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Add creator as stage manager participant
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const { error: participantError } = await supabase
        .from("session_participants")
        .insert({
          session_id: sessionData.id,
          user_id: userId,
          role: "stage_manager" as const,
        });

      if (participantError) throw participantError;

      setCreatedCode(codeData);
      toast({
        title: "Session created!",
        description: `Session code: ${codeData}`,
      });

      // Wait for user to acknowledge before joining
      setTimeout(() => {
        onSessionJoined(sessionData.id, "stage_manager");
      }, 3000);
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

  const handleJoinSession = async () => {
    if (!sessionCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Find session by code
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("session_code", sessionCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (sessionError || !sessionData) {
        throw new Error("Invalid session code");
      }

      // Check password if required
      if (sessionData.password) {
        if (!password) {
          toast({
            title: "Password required",
            description: "This session requires a password",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        if (sessionData.password !== password) {
          throw new Error("Incorrect password");
        }
      }

      // Check if already a participant
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data: existingParticipant } = await supabase
        .from("session_participants")
        .select("role")
        .eq("session_id", sessionData.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingParticipant) {
        // Already joined, just continue with existing role
        onSessionJoined(sessionData.id, existingParticipant.role);
      } else {
        // New participant - need to select role
        // For now, pass empty role to trigger role selection
        onSessionJoined(sessionData.id, "");
      }
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

  if (createdCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Session Created!</CardTitle>
            <CardDescription>Share this code with your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Session Code</p>
              <p className="text-4xl font-bold tracking-wider">{createdCode}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Starting session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Start New Session</CardTitle>
            <CardDescription>Create a session for your team to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionName">Session Name</Label>
              <Input
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Evening Performance"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="usePassword"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="usePassword">Password protect this session</Label>
            </div>
            {usePassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter session password"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode("select")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleStartSession}
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join Session</CardTitle>
            <CardDescription>Enter the session code to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Session Code</Label>
              <Input
                id="code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="uppercase tracking-wider text-center text-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinPassword">Password (if required)</Label>
              <Input
                id="joinPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank if no password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode("select")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleJoinSession}
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome, {username}!</CardTitle>
          <CardDescription>Choose how you'd like to proceed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasStageManagerRole && (
            <Button
              onClick={() => setMode("start")}
              className="w-full h-20 text-lg"
              variant="default"
            >
              Start New Session
            </Button>
          )}
          <Button
            onClick={() => setMode("join")}
            className="w-full h-20 text-lg"
            variant="outline"
          >
            Join Existing Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
