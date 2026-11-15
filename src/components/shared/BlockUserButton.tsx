/**
 * BlockUserButton — lets a user block the author of a review (Apple 1.2).
 *
 * Flow: auth gate (SignInSheet when logged out) → confirm dialog →
 * POST /users/block/:userId → toast. The review lists hide the reviews of
 * this author at once (blockedUsersStore).
 *
 * Hidden when the review has no author id, or when the review belongs to the
 * user. RTL-safe. Gluestack only. No hardcoded hex.
 */

import { useRef } from "react";
import { Pressable } from "react-native";
import { Ban } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { confirmAlert } from "@/components/ui/alert-dialog";
import { useColors } from "@/hooks/useColors";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";
import { useAuthGate } from "@/auth/useAuthGate";
import { useAuthStore } from "@/stores/authStore";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";
import { showToast } from "@/stores/toastStore";

interface BlockUserButtonProps {
  reviewerId?: string;
}

export function BlockUserButton({ reviewerId }: BlockUserButtonProps) {
  const { t, isRtl } = useCustomTranslation();
  const colors = useColors();
  const { requireAuth } = useAuthGate();
  const userSub = useAuthStore((s) => s.user?.sub);
  const block = useBlockedUsersStore((s) => s.block);
  // A ref, not state: two taps in the same frame both see the old state.
  const running = useRef(false);

  if (!reviewerId) return null;
  if (userSub && userSub === reviewerId) return null;

  const run = async () => {
    if (running.current) return;
    running.current = true;
    try {
      await block(reviewerId);
      showToast(t("userBlocked"));
    } catch {
      showToast(t("blockUserFailed"));
    } finally {
      running.current = false;
    }
  };

  const handlePress = () =>
    requireAuth(() =>
      confirmAlert(t("blockUserConfirmTitle"), t("blockUserConfirmMessage"), [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("blockUser"), style: "destructive", onPress: () => void run() },
      ])
    );

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={t("blockUser")}
      testID="review-block"
      className={`flex-row items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}
    >
      <Ban size={14} color={colors.mutedForeground} />
      <Text className="text-xs text-muted-foreground">{t("blockUser")}</Text>
    </Pressable>
  );
}
