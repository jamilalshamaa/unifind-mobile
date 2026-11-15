/**
 * ReportReviewButton — Apple 1.2: a user can report a review of another user.
 * Confirm → POST /reviews/:id/report → toast. Hidden on the user's own review
 * and on a review with no id. Logged out → SignInSheet, no call.
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { ReportReviewButton } from "@/components/shared/ReportReviewButton";
import { _registerAlertDialogShow, type AlertAction } from "@/components/ui/alert-dialog";
import { nodeApi } from "@/api/nodeApi";
import { useAuthStore } from "@/stores/authStore";
import * as toastStore from "@/stores/toastStore";
import { useSignInSheetStore } from "@/auth/signInSheetStore";

let confirm: "destructive" | "cancel" = "destructive";

function signIn(sub = "auth0|me") {
  useAuthStore.setState({ isLoggedIn: true, user: { sub, userID: sub.split("|")[1] } });
}

beforeEach(() => {
  jest.clearAllMocks();
  confirm = "destructive";
  useAuthStore.setState({ isLoggedIn: false, user: null });
  _registerAlertDialogShow(({ actions }: { actions?: AlertAction[] }) => {
    actions?.find((a) => a.style === confirm)?.onPress?.();
  });
});

describe("ReportReviewButton", () => {
  it("reports the review and shows a toast", async () => {
    signIn();
    const toast = jest.spyOn(toastStore, "showToast");
    render(<ReportReviewButton reviewId="r1" reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-report"));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("reviewReported"));
    expect(nodeApi.post).toHaveBeenCalledWith("/reviews/r1/report", {});
    toast.mockRestore();
  });

  it("does nothing when the user cancels", () => {
    signIn();
    confirm = "cancel";
    render(<ReportReviewButton reviewId="r1" reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-report"));
    expect(nodeApi.post).not.toHaveBeenCalled();
  });

  it("shows the already-reported toast on a 409", async () => {
    signIn();
    (nodeApi.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 409 },
    });
    const toast = jest.spyOn(toastStore, "showToast");
    render(<ReportReviewButton reviewId="r1" reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-report"));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("reviewAlreadyReported"));
    toast.mockRestore();
  });

  it("shows an error toast when the call fails", async () => {
    signIn();
    (nodeApi.post as jest.Mock).mockRejectedValueOnce(new Error("500"));
    const toast = jest.spyOn(toastStore, "showToast");
    render(<ReportReviewButton reviewId="r1" reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-report"));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("reportReviewFailed"));
    toast.mockRestore();
  });

  it("is hidden on the user's own review", () => {
    signIn("auth0|me");
    render(<ReportReviewButton reviewId="r1" reviewerId="auth0|me" />);
    expect(screen.queryByTestId("review-report")).toBeNull();
  });

  it("is hidden when the review has no id", () => {
    signIn();
    render(<ReportReviewButton reviewerId="auth0|other" />);
    expect(screen.queryByTestId("review-report")).toBeNull();
  });

  it("opens the sign-in sheet and sends nothing when logged out", () => {
    render(<ReportReviewButton reviewId="r1" reviewerId="auth0|other" />);
    fireEvent.press(screen.getByTestId("review-report"));
    expect(nodeApi.post).not.toHaveBeenCalled();
    expect(useSignInSheetStore.getState().isOpen).toBe(true);
  });
});
