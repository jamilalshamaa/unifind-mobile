/**
 * BlockedUsersSection — one row per blocked user with Unblock. Hidden when
 * the list is empty.
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { BlockedUsersSection } from "@/screens/profile/tabs/BlockedUsersSection";
import { nodeApi } from "@/api/nodeApi";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";
import * as toastStore from "@/stores/toastStore";

beforeEach(() => {
  jest.clearAllMocks();
  useBlockedUsersStore.setState({ ids: [] });
});

describe("BlockedUsersSection", () => {
  it("is hidden when no user is blocked", () => {
    render(<BlockedUsersSection />);
    expect(screen.queryByTestId("profile-blocked-users")).toBeNull();
  });

  it("unblocks a user and removes the row", async () => {
    useBlockedUsersStore.setState({ ids: ["auth0|a", "auth0|b"] });
    (nodeApi.delete as jest.Mock).mockResolvedValueOnce({ data: { blockedUsers: ["auth0|b"] } });
    const toast = jest.spyOn(toastStore, "showToast");
    render(<BlockedUsersSection />);
    expect(screen.getByText("blockedUsers")).toBeTruthy();

    fireEvent.press(screen.getByTestId("unblock-0"));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("userUnblocked"));
    expect(nodeApi.delete).toHaveBeenCalledWith("/users/block/auth0%7Ca");
    expect(screen.queryByTestId("unblock-1")).toBeNull();
    toast.mockRestore();
  });
});
