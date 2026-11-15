import { ReactNode } from "react";
import { View } from "react-native";
import { KeyboardSafeScrollView } from "@/components/shared/KeyboardSafeScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

/**
 * Outermost wrapper for every screen.
 *
 * Insets: the top edge is always padded (notch / status bar). Pass
 * `bottomInset` on screens with no tab bar below them and content that can
 * reach the bottom (centered status pages), so it stays clear of the home
 * indicator.
 */
export function ScreenContainer({
  children,
  padded,
  scroll,
  bottomInset,
  className,
}: {
  children: ReactNode;
  padded?: boolean;
  scroll?: boolean;
  bottomInset?: boolean;
  className?: string;
}) {
  const inner = (
    <View className={cn("flex-1", padded && "px-4 py-3", className)}>{children}</View>
  );
  return (
    <SafeAreaView edges={bottomInset ? ["top", "bottom"] : ["top"]} className="flex-1 bg-background">
      {scroll ? (
        <KeyboardSafeScrollView contentContainerStyle={{ flexGrow: 1 }}>{inner}</KeyboardSafeScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}
