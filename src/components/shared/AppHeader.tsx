import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { ContentColumn } from "@/components/shared/ContentColumn";
import { useColors } from "@/hooks/useColors";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";

/**
 * Standard screen header. `showBack` adds an RTL-aware back button.
 *
 * RTL: native layout stays LTR (see src/i18n/language.ts), so the row is
 * mirrored by hand: back button on the right, title aligned right.
 * Wide screens: the row sits in the same centered column as the content, so
 * the title lines up with the card edges below it.
 * `onBack` replaces router.back() (e.g. inside a Modal, where router.back()
 * would leave the screen).
 */
export function AppHeader({
  title,
  showBack,
  onBack,
}: {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}) {
  const router = useRouter();
  const colors = useColors();
  const { isRtl } = useCustomTranslation();
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  return (
    <View className="border-b border-border bg-background px-4">
      <ContentColumn
        className={`min-h-[52px] items-center gap-2 py-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
      >
        {showBack && (
          <Pressable
            onPress={onBack ?? (() => router.back())}
            // p-1 pads the visual chrome; hitSlop expands the touch area to ≥44px
            className="p-1"
            hitSlop={14}
            accessibilityRole="button"
          >
            <BackIcon size={26} color={colors.foreground} />
          </Pressable>
        )}
        <Heading
          size="lg"
          numberOfLines={1}
          className={`flex-1 ${isRtl ? "text-right" : "text-left"}`}
        >
          {title}
        </Heading>
      </ContentColumn>
    </View>
  );
}
