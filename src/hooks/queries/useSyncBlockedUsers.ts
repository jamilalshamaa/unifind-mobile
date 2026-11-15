/**
 * Keeps blockedUsersStore in step with the session (mount once, in AppServices).
 *
 * - Sign-in: load the blocked list from the server.
 * - Sign-out: clear the list.
 * - List change: invalidate the review queries, so that the next server data
 *   also has no reviews of the blocked users.
 */

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";

export function useSyncBlockedUsers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (useAuthStore.getState().isLoggedIn) void useBlockedUsersStore.getState().load();
    const unAuth = useAuthStore.subscribe((state, prev) => {
      if (!prev.isLoggedIn && state.isLoggedIn) void useBlockedUsersStore.getState().load();
      if (prev.isLoggedIn && !state.isLoggedIn) useBlockedUsersStore.getState().reset();
    });
    const unBlocked = useBlockedUsersStore.subscribe((state, prev) => {
      if (state.ids !== prev.ids) {
        void queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      }
    });
    return () => {
      unAuth();
      unBlocked();
    };
  }, [queryClient]);
}
