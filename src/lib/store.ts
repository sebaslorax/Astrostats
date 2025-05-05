"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppData, Team, Player, JumpTestData } from './types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface AstroState extends AppData {
  // Teams Actions
  addTeam: (name: string) => void;
  removeTeam: (teamId: string) => void; // Also removes players in that team
  updateTeam: (teamId: string, name: string) => void;

  // Players Actions
  addPlayer: (playerData: Omit<Player, 'id' | 'jumpData'>) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, playerData: Partial<Omit<Player, 'id' | 'teamId' | 'jumpData'>>) => void;
  getPlayerById: (playerId: string) => Player | undefined;
  getPlayersByTeam: (teamId: string) => Player[];

  // Jump Data Actions
  addJumpData: (playerId: string, jumpData: Omit<JumpTestData, 'id'>) => void;
  getJumpDataForPlayer: (playerId: string) => JumpTestData[];

  // Hydration flag
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const useStore = create<AstroState>()(
  persist(
    (set, get) => ({
      teams: [],
      players: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      // --- Teams ---
      addTeam: (name) => {
        const newTeam: Team = { id: uuidv4(), name };
        set((state) => ({ teams: [...state.teams, newTeam] }));
      },
      removeTeam: (teamId) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
          // Remove players associated with the deleted team
          players: state.players.filter((player) => player.teamId !== teamId),
        }));
      },
      updateTeam: (teamId, name) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, name } : team
          ),
        }));
      },

      // --- Players ---
      addPlayer: (playerData) => {
        const newPlayer: Player = {
          ...playerData,
          id: uuidv4(),
          jumpData: [],
        };
        set((state) => ({ players: [...state.players, newPlayer] }));
      },
      removePlayer: (playerId) => {
        set((state) => ({
          players: state.players.filter((player) => player.id !== playerId),
        }));
      },
      updatePlayer: (playerId, playerData) => {
        set((state) => ({
          players: state.players.map((player) =>
            player.id === playerId ? { ...player, ...playerData } : player
          ),
        }));
      },
      getPlayerById: (playerId) => {
        return get().players.find((player) => player.id === playerId);
      },
       getPlayersByTeam: (teamId) => {
        return get().players.filter((player) => player.teamId === teamId);
      },


      // --- Jump Data ---
      addJumpData: (playerId, jumpData) => {
        const newJumpEntry: JumpTestData = { ...jumpData, id: uuidv4() };
        set((state) => ({
          players: state.players.map((player) =>
            player.id === playerId
              ? {
                  ...player,
                  // Add new data and sort by date descending
                  jumpData: [...player.jumpData, newJumpEntry].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                  ),
                }
              : player
          ),
        }));
      },
      getJumpDataForPlayer: (playerId) => {
         const player = get().getPlayerById(playerId);
         return player ? player.jumpData : [];
      },

    }),
    {
      name: 'astro-stats-storage', // Name for the local storage item
      storage: createJSONStorage(() => localStorage), // Use localStorage
      onRehydrateStorage: () => (state) => {
          if (state) {
            state.setHasHydrated(true);
          }
       }
    }
  )
);

// Custom hook to safely access store state after hydration
export const useAstroStore = <T>(selector: (state: AstroState) => T): T | undefined => {
  const state = useStore(selector);
  const hasHydrated = useStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    // Return undefined or a default value during server render or before hydration
    return undefined;
  }

  return state;
};

// Hook to get all actions (or specific actions if needed)
export const useAstroActions = () => useStore((state) => ({
  addTeam: state.addTeam,
  removeTeam: state.removeTeam,
  updateTeam: state.updateTeam,
  addPlayer: state.addPlayer,
  removePlayer: state.removePlayer,
  updatePlayer: state.updatePlayer,
  addJumpData: state.addJumpData,
}));

// Hook specifically for checking hydration status
export const useHasHydrated = () => useStore((state) => state._hasHydrated);

export default useStore; // Export the base store if needed elsewhere
