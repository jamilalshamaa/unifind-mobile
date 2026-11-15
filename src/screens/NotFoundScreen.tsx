/**
 * NotFoundScreen — 404 branded full-screen page.
 *
 * Prussian background, centered content:
 *   Logo (white) → "404" → pageNotFound → pageNotFoundDesc → Go Home button
 * RTL-safe. No API calls.
 */

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ContentColumn, NARROW_MAX_WIDTH } from "@/components/shared/ContentColumn";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";

export default function NotFoundScreen() {
  const { t } = useCustomTranslation();
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-primary">
      <ContentColumn maxWidth={NARROW_MAX_WIDTH} className="flex-1 items-center justify-center px-8 gap-6">
        <Logo variant="white" height={36} />

        <Heading
          size="xl"
          className="text-secondary font-bold text-center tracking-tight"
          style={{ fontSize: 72, lineHeight: 80 }}
        >
          404
        </Heading>

        <Heading size="lg" className="text-primary-foreground font-bold text-center">
          {t("pageNotFound")}
        </Heading>

        <Text className="text-primary-foreground/85 text-sm text-center leading-relaxed">
          {t("pageNotFoundDesc")}
        </Text>

        <Button
          label={t("goToHome")}
          action="secondary"
          onPress={() => router.replace("/(main)/(tabs)/home")}
          className="mt-2 min-w-48"
        />
      </ContentColumn>
    </SafeAreaView>
  );
}
