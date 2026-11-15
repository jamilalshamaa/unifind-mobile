/**
 * blockedUsersStore — the Auth0 ids of the users that the signed-in user
 * blocked (Apple 1.2).
 *
 * The review lists remove the reviews of these users at once, before the
 * server data refreshes. The server also removes them when the request has a
 * token. useSyncBlockedUsers loads the list on sign-in and clears it on
 * sign-out.
 */

import { create } from "zustand";
import { blockApi } from "@/api/blockApi";

interface BlockedUsersState {
  ids: string[];
  /** Load the list from the server. A failure keeps the current list. */
  load: () => Promise<void>;
  /** Block a user. The id is added first, and removed again on failure. */
  block: (userId: string) => Promise<void>;
  /** Unblock a user. The id is removed first, and added again on failure. */
  unblock: (userId: string) => Promise<void>;
  reset: () => void;
}

export const useBlockedUsersStore = create<BlockedUsersState>((set, get) => ({
  ids: [],

  load: async () => {
    try {
      set({ ids: await blockApi.getBlockedUsers() });
    } catch {
      // Keep the current list: the server still filters the lists.
    }
  },

  block: async (userId) => {
    const before = get().ids;
    if (!before.includes(userId)) set({ ids: [...before, userId] });
    try {
      set({ ids: await blockApi.blockUser(userId) });
    } catch (error) {
      set({ ids: get().ids.filter((id) => id !== userId || before.includes(id)) });
      throw error;
    }
  },

  unblock: async (userId) => {
    set({ ids: get().ids.filter((id) => id !== userId) });
    try {
      set({ ids: await blockApi.unblockUser(userId) });
    } catch (error) {
      if (!get().ids.includes(userId)) set({ ids: [...get().ids, userId] });
      throw error;
    }
  },

  reset: () => set({ ids: [] }),
}));

/** True when the author of a review is blocked. */
export function isBlockedAuthor(ids: string[], reviewerId?: string): boolean {
  return !!reviewerId && ids.includes(reviewerId);
}
