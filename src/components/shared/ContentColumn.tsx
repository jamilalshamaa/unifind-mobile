import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { cn } from "@/lib/utils";
import { CONTENT_MAX_WIDTH } from "@/config/theme";

/**
 * Max width (pt) of the readable content column on wide screens (tablet, web).
 * Phones (320–430pt) are narrower, so on a phone the column is full width.
 * Mirrors the centered container of unifind.online.
 */
export { CONTENT_MAX_WIDTH };

/** Narrow column for a single focused action (status pages, 404, empty states). */
export const NARROW_MAX_WIDTH = 440;

/**
 * ContentColumn — full width on phones, centered and capped at `maxWidth` on
 * wide screens. Put it inside a ScrollView / screen so cards keep aligned edges
 * with the AppHeader at every width.
 */
export function ContentColumn({
  children,
  className,
  style,
  maxWidth = CONTENT_MAX_WIDTH,
  testID,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      className={cn("w-full self-center", className)}
      style={[{ maxWidth }, style]}
    >
      {children}
    </View>
  );
}
