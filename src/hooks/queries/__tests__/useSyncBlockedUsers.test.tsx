import type { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeTestQueryClient } from "@/test-utils/renderWithProviders";
import { useSyncBlockedUsers } from "@/hooks/queries/useSyncBlockedUsers";
import { useAuthStore } from "@/stores/authStore";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";
import { nodeApi } from "@/api/nodeApi";

describe("useSyncBlockedUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ isLoggedIn: false, user: null });
    useBlockedUsersStore.setState({ ids: [] });
  });

  it("loads on sign-in, invalidates testimonials on change, clears on sign-out", async () => {
    const client = makeTestQueryClient();
    const invalidate = jest.spyOn(client, "invalidateQueries");
    (nodeApi.get as jest.Mock).mockResolvedValueOnce({ data: { blockedUsers: ["auth0|x"] } });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    renderHook(() => useSyncBlockedUsers(), { wrapper });

    act(() => useAuthStore.setState({ isLoggedIn: true }));
    await waitFor(() => expect(useBlockedUsersStore.getState().ids).toEqual(["auth0|x"]));
    expect(nodeApi.get).toHaveBeenCalledWith("/users/blocked");
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["testimonials"] });

    act(() => useAuthStore.setState({ isLoggedIn: false }));
    expect(useBlockedUsersStore.getState().ids).toEqual([]);
  });
});
