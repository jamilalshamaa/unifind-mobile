/**
 * HomeSkeleton — full-page loading placeholder for the entire home screen.
 *
 * Shows ONE cohesive skeleton for every section at once (hero + find card,
 * guide, carousels, numbers grid, testimonials) so the page never loads
 * partially — no section pops in while another is still a placeholder.
 * Shape mirrors HomeScreen so nothing shifts when the real content arrives.
 *
 * Wide screens use the same 840 px centred column and the same 720 px
 * breakpoint (2-column guide cards, 3-column stats) as the real sections.
 *
 * Light-mode only (the app is locked to light): bones are `bg-foreground/10`
 * on white surfaces and `bg-white/15` on the prussian bands.
 */

import { type ViewStyle } from "react-native";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useColors } from "@/hooks/useColors";

/** Same centred content column as the real home sections. */
const COLUMN = "w-full max-w-[840px] self-center";
/** FeaturedCard is a fixed 280 × 380 card with a 150 px image. */
const CARD_W = 280;
const CARD_H = 380;
const CARD_IMG_H = 150;

/** Light bone (on white surfaces). */
const L = "bg-foreground/10";
/** Dark-band bone (on prussian surfaces). */
const D = "bg-white/15";

/** A horizontal row of 3 card bones (carousel placeholder). */
function CardRow({ tone }: { tone: string }) {
  return (
    <View className="flex-row gap-3 overflow-hidden px-4">
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          className={`rounded-2xl overflow-hidden flex-shrink-0 ${tone}`}
          style={{ width: CARD_W, height: CARD_H }}
        >
          <Skeleton className={`w-full ${tone}`} style={{ height: CARD_IMG_H }} />
          <View className="p-3 gap-2">
            <Skeleton className={`h-4 w-40 rounded ${tone}`} />
            <Skeleton className={`h-3 w-24 rounded-full ${tone}`} />
            <Skeleton className={`h-3 w-full rounded ${tone}`} />
            <Skeleton className={`h-3 w-2/3 rounded ${tone}`} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** A section title bone (accent bar + text). */
function TitleBone({ tone }: { tone: string }) {
  return (
    <View className="flex-row items-center gap-2 px-4 mb-5">
      <Skeleton className={`w-1 h-6 rounded-full ${tone}`} />
      <Skeleton className={`h-5 w-48 rounded-lg ${tone}`} />
    </View>
  );
}

export function HomeSkeleton() {
  const colors = useColors();
  const { width } = useWindowDimensions();
  // Same breakpoint as GuideSection / NumbersSection.
  const wide = width >= 720;
  const statRows = wide ? [[0, 1, 2], [3, 4, 5]] : [[0, 1], [2, 3], [4, 5]];
  const band = { borderTopWidth: 2, borderTopColor: colors.secondary };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background" testID="home-skeleton">
      {/* ── Hero band + find card ─────────────────────────────────────────── */}
      <View className="bg-prussian">
        <View className={`${COLUMN} px-5 pt-3 pb-8`}>
          {/* App bar: wordmark + lang + avatar */}
          <View className="flex-row items-center justify-between mb-7">
            <Skeleton className={`h-7 w-28 rounded-lg ${D}`} />
            <View className="flex-row items-center gap-2">
              <Skeleton className={`h-8 w-14 rounded-full ${D}`} />
              <Skeleton className={`h-9 w-9 rounded-full ${D}`} />
            </View>
          </View>
          {/* Greeting */}
          <Skeleton className={`h-4 w-40 rounded mb-2 ${D}`} />
          <Skeleton className={`h-8 w-56 rounded mb-6 ${D}`} />

          {/* Floating find card */}
          <View className="bg-card rounded-3xl p-4 gap-3">
            {/* Segmented control */}
            <View className="flex-row gap-2">
              <Skeleton className={`flex-1 h-11 rounded-2xl ${L}`} />
              <Skeleton className={`flex-1 h-11 rounded-2xl ${L}`} />
              <Skeleton className={`flex-1 h-11 rounded-2xl ${L}`} />
            </View>
            {/* Three fields */}
            <Skeleton className={`w-full rounded-xl ${L}`} style={{ height: 52 } as ViewStyle} />
            <Skeleton className={`w-full rounded-xl ${L}`} style={{ height: 52 } as ViewStyle} />
            <Skeleton className={`w-full rounded-xl ${L}`} style={{ height: 52 } as ViewStyle} />
            {/* Find button */}
            <Skeleton className={`w-full rounded-2xl ${L}`} style={{ height: 52 } as ViewStyle} />
          </View>
        </View>
      </View>

      {/* ── Guide section (white) ─────────────────────────────────────────── */}
      <View className="bg-background pt-12 pb-10 px-4">
        <View className={COLUMN}>
          <View className="-mx-4">
            <TitleBone tone={L} />
          </View>
          {/* Two GuideCard blocks: stacked on phones, side by side on wide screens */}
          <View className="gap-4" style={wide ? { flexDirection: "row" } : undefined}>
            {[0, 1].map((i) => (
              <View key={i} className={`rounded-2xl overflow-hidden ${L}`} style={wide ? { flex: 1 } : undefined}>
                <Skeleton className={`w-full ${L}`} style={{ height: 360 }} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ── Offerings carousel (prussian band) ────────────────────────────── */}
      <View className="bg-prussian" style={band}>
        <View className={`${COLUMN} pt-7 pb-6`}>
          <TitleBone tone={D} />
          <CardRow tone={D} />
        </View>
      </View>

      {/* ── Numbers grid (prussian band) ──────────────────────────────────── */}
      <View className="bg-prussian" style={band}>
        <View className={`${COLUMN} pt-7 pb-6 px-4`}>
          <View className="-mx-4">
            <TitleBone tone={D} />
          </View>
          {/* StatTile grid: 2 columns on phones, 3 on wide screens (120 px tiles) */}
          <View className="gap-3">
            {statRows.map((row) => (
              <View key={row.join("-")} className="flex-row gap-3">
                {row.map((i) => (
                  <Skeleton key={i} className={`flex-1 rounded-2xl ${D}`} style={{ height: 120 } as ViewStyle} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
