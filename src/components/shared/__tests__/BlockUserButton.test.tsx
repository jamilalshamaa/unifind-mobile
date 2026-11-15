/**
 * BlockUserButton — Apple 1.2: a user can block the author of a review.
 * Confirm → POST /users/block/:userId → toast, and the author id goes into
 * blockedUsersStore at once. Hidden on the user's own review and on a review
 * with no author id. Logged out → SignInSheet, no call.
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { BlockUserButton } from "@/components/shared/BlockUserButton";
import { _registerAlertDialogShow, type AlertAction } from "@/components/ui/alert-dialog";
import { nodeApi } from "@/api/nodeApi";
import { useAuthStore } from "@/stores/authStore";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";
import * as toastStore from "@/stores/toastStore";
import { useSignInSheetStore } from "@/auth/signInSheetStore";

let confirm: "destructive" | "cancel" = "destructive";
let lastTitle = "";
let lastMessage = "";

function signIn(sub = "auth0|me") {
  useAuthStore.setState({ isLoggedIn: true, user: { sub, userID: sub.split("|")[1] } });
}

beforeEach(() => {
  jest.clearAllMocks();
  confirm = "destructive";
  useAuthStore.setState({ isLoggedIn: false, user: null });
  useBlockedUsersStore.setState({ ids: [] });
  _registerAlertDialogShow(
    ({ title, message, actions }: { title?: string; message?: string; actions?: AlertAction[] }) => {
      lastTitle = title ?? "";
      lastMessage = message ?? "";
      actions?.find((a) => a.style === confirm)?.onPress?.();
    }
  );
});

describe("BlockUserButton", () => {
  it("asks to confirm, blocks the author and shows a toast", async () => {
    signIn();
    (nodeApi.post as jest.Mock).mockResolvedValueOnce({ data: { blockedUsers: ["auth0|other"] } });
    const toast = jest.spyOn(toastStore, "showToast");
    render(<BlockUserButton reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-block"));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("userBlocked"));
    expect(lastTitle).toBe("blockUserConfirmTitle");
    expect(lastMessage).toBe("blockUserConfirmMessage");
    expect(nodeApi.post).toHaveBeenCalledWith("/users/block/auth0%7Cother", {});
    expect(useBlockedUsersStore.getState().ids).toEqual(["auth0|other"]);
    toast.mockRestore();
  });

  it("does nothing when the user cancels", () => {
    signIn();
    confirm = "cancel";
    render(<BlockUserButton reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-block"));
    expect(nodeApi.post).not.toHaveBeenCalled();
    expect(useBlockedUsersStore.getState().ids).toEqual([]);
  });

  it("shows an error toast and removes the id again when the call fails", async () => {
    signIn();
    (nodeApi.post as jest.Mock).mockRejectedValueOnce(new Error("500"));
    const toast = jest.spyOn(toastStore, "showToast");
    render(<BlockUserButton reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-block"));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("blockUserFailed"));
    expect(useBlockedUsersStore.getState().ids).toEqual([]);
    toast.mockRestore();
  });

  it("is hidden on the user's own review", () => {
    signIn("auth0|me");
    render(<BlockUserButton reviewerId="auth0|me" />);
    expect(screen.queryByTestId("review-block")).toBeNull();
  });

  it("is hidden when the review has no author id", () => {
    signIn();
    render(<BlockUserButton />);
    expect(screen.queryByTestId("review-block")).toBeNull();
  });

  it("opens the sign-in sheet and sends nothing when logged out", () => {
    render(<BlockUserButton reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-block"));
    expect(nodeApi.post).not.toHaveBeenCalled();
    expect(useSignInSheetStore.getState().isOpen).toBe(true);
  });
});
