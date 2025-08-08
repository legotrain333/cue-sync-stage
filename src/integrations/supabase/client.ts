// Mock Supabase client for development
// Replace with actual Supabase client when ready

interface MockUser {
  id: string;
  username: string;
  roles: Array<{
    id: string;
    role: 'stage_manager' | 'operator' | 'director' | 'director_plus' | 'admin';
  }>;
}

// Mock authentication service
export const mockAuth = {
  signIn: async (username: string, password: string): Promise<MockUser | null> => {
    // Simple mock authentication
    if (username && password) {
      // Mock different users with different role combinations
      const mockUsers: Record<string, MockUser> = {
        'stagemanager': {
          id: '1',
          username: 'stagemanager',
          roles: [{ id: '1', role: 'stage_manager' }],
        },
        'operator': {
          id: '2', 
          username: 'operator',
          roles: [{ id: '2', role: 'operator' }],
        },
        'director': {
          id: '3',
          username: 'director', 
          roles: [{ id: '3', role: 'director' }],
        },
        'admin': {
          id: '4',
          username: 'admin',
          roles: [
            { id: '4', role: 'stage_manager' },
            { id: '5', role: 'operator' },
            { id: '6', role: 'director' },
            { id: '7', role: 'director_plus' },
          ],
        },
      };
      
      return mockUsers[username.toLowerCase()] || {
        id: '999',
        username,
        roles: [{ id: '999', role: 'operator' }],
      };
    }
    return null;
  },
  
  signOut: async (): Promise<void> => {
    // Mock sign out
    console.log('User signed out');
  },
};

// Mock database operations
export const mockDb = {
  getCues: async (showId: string) => {
    // Mock cue data
    return [
      { id: 1, number: "1", department: "Lighting", description: "House lights fade", notes: "Slow 5 count", hold: false },
      { id: 2, number: "2", department: "Sound", description: "Preshow music fade", notes: "Cross fade to silence", hold: false },
      { id: 3, number: "3", department: "Lighting", description: "Stage wash up", notes: "Quick snap", hold: false },
      { id: 4, number: "4", department: "Spot", description: "Follow spot on actor center", notes: "Track movement to DSR", hold: false },
      { id: 5, number: "5", department: "Sound", description: "Thunder sound effect", notes: "Build slowly", hold: true },
      { id: 6, number: "6", department: "Spot", description: "Spot fade out", notes: "Slow fade", hold: false },
    ];
  },
  
  updateCueProgress: async (showId: string, cueId: string, status: string) => {
    console.log(`Cue ${cueId} status updated to ${status}`);
    return true;
  },
  
  updateOperatorStatus: async (userId: string, showId: string, isReady: boolean) => {
    console.log(`Operator ${userId} ready status: ${isReady}`);
    return true;
  },
  
  sendAnnouncement: async (showId: string, message: string, senderId: string) => {
    console.log(`Announcement from ${senderId}: ${message}`);
    return true;
  },
};