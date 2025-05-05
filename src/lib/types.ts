export interface JumpTestData {
  id: string; // Unique ID for each test entry
  date: string; // ISO string date
  flightTime: number;
  jumpHeight: number;
  repetitionIndex: number;
  contactTime: number;
}

export interface Player {
  id: string; // Unique ID for each player
  firstName: string;
  lastName: string;
  dob: string; // ISO string date
  sex: 'Male' | 'Female' | 'Other' | ''; // Allow empty initial value
  height: number | ''; // In cm, allow empty
  weight: number | ''; // In kg, allow empty
  teamId: string; // ID of the team they belong to
  jumpData: JumpTestData[]; // Array of jump test results
}

export interface Team {
  id: string; // Unique ID for each team
  name: string;
}

// Structure for the entire app's data in local storage
export interface AppData {
  teams: Team[];
  players: Player[];
}
