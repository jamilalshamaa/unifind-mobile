/**
 * ReportReviewButton — lets a user report a review of another user (Apple 1.2).
 *
 * Flow: auth gate (SignInSheet when logged out) → confirm dialog →
 * POST /reviews/:id/report → toast. The backend hides a review with 3 reports
 * until the team checks it in the admin.
 *
 * Hidden when the review has no id, or when the review belongs to the user.
 * RTL-safe. Gluestack only. No hardcoded hex.
 */

import { useRef } from "react";
import { Pressable } from "react-native";
import { isAxiosError } from "axios";
import { Flag } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { confirmAlert } from "@/components/ui/alert-dialog";
import { useColors } from "@/hooks/useColors";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";
import { useAuthGate } from "@/auth/useAuthGate";
import { useAuthStore } from "@/stores/authStore";
import { reviewsApi } from "@/api/reviewsApi";
import { showToast } from "@/stores/toastStore";

interface ReportReviewButtonProps {
  reviewId?: string;
  reviewerId?: string;
}

export function ReportReviewButton({ reviewId, reviewerId }: ReportReviewButtonProps) {
  const { t, isRtl } = useCustomTranslation();
  const colors = useColors();
  const { requireAuth } = useAuthGate();
  const userSub = useAuthStore((s) => s.user?.sub);
  // A ref, not state: two taps in the same frame both see the old state.
  const running = useRef(false);

  if (!reviewId) return null;
  if (userSub && reviewerId && userSub === reviewerId) return null;

  const report = async () => {
    if (running.current) return;
    running.current = true;
    try {
      await reviewsApi.reportReview(reviewId);
      showToast(t("reviewReported"));
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      showToast(status === 409 ? t("reviewAlreadyReported") : t("reportReviewFailed"));
    } finally {
      running.current = false;
    }
  };

  const handlePress = () =>
    requireAuth(() =>
      confirmAlert(t("reportReviewConfirmTitle"), t("reportReviewConfirmMessage"), [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("reportReview"), style: "destructive", onPress: () => void report() },
      ])
    );

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={t("reportReview")}
      testID="review-report"
      className={`flex-row items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}
    >
      <Flag size={14} color={colors.mutedForeground} />
      <Text className="text-xs text-muted-foreground">{t("reportReview")}</Text>
    </Pressable>
  );
}
