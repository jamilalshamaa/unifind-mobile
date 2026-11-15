/**
 * BlockedUsersSection — the users that the signed-in user blocked, with an
 * Unblock action on each row (Apple 1.2).
 *
 * The backend keeps only the Auth0 ids, thus a row shows a numbered label,
 * not a name. Hidden when the list is empty.
 */

import { useRef } from "react";
import { View } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";
import { showToast } from "@/stores/toastStore";

export function BlockedUsersSection() {
  const { t, isRtl } = useCustomTranslation();
  const ids = useBlockedUsersStore((s) => s.ids);
  const unblock = useBlockedUsersStore((s) => s.unblock);
  const running = useRef(false);

  if (ids.length === 0) return null;

  const handleUnblock = async (userId: string) => {
    if (running.current) return;
    running.current = true;
    try {
      await unblock(userId);
      showToast(t("userUnblocked"));
    } catch {
      showToast(t("unblockUserFailed"));
    } finally {
      running.current = false;
    }
  };

  return (
    <View className="bg-card rounded-2xl p-4 gap-3" testID="profile-blocked-users">
      <Heading size="sm" className={`text-foreground ${isRtl ? "text-right" : ""}`}>
        {t("blockedUsers")}
      </Heading>
      {ids.map((id, i) => (
        <View
          key={id}
          className={`flex-row items-center justify-between gap-3 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <Text
            className={`text-sm text-foreground flex-1 ${isRtl ? "text-right" : ""}`}
            numberOfLines={1}
          >
            {t("blockedUser")} {i + 1}
          </Text>
          <Button
            label={t("unblockUser")}
            variant="outline"
            className="h-9 px-3"
            onPress={() => void handleUnblock(id)}
            testID={`unblock-${i}`}
          />
        </View>
      ))}
    </View>
  );
}
