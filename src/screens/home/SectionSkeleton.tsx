/**
 * SectionSkeleton — lightweight loading placeholder for home carousels.
 *
 * Mirrors the real section: same `pt-7 pb-6` rhythm, same centred 840 px
 * column, same card size. Dark = FeaturedCard (280 × 380, 150 px image);
 * light = TestimonialCard (w-72, h-28 image).
 */

import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { useColors } from "@/hooks/useColors";

interface SectionSkeletonProps {
  dark?: boolean;
}

export function SectionSkeleton({ dark }: SectionSkeletonProps) {
  const colors = useColors();
  const boneBase = dark ? "bg-white/20" : "bg-muted";
  const card = dark ? { width: 280, height: 380 } : { width: 288 };
  const imageClass = dark ? "w-full h-[150px]" : "w-full h-28";

  return (
    <View
      className={dark ? "bg-prussian" : "bg-background"}
      // Dark bands carry the same turquoise top accent as the real sections.
      style={dark ? { borderTopWidth: 2, borderTopColor: colors.secondary } : undefined}
    >
      <View className="w-full max-w-[840px] self-center pt-7 pb-6 px-4">
        {/* Title row skeleton: accent bar + text */}
        <View className="flex-row items-center gap-2 mb-5">
          <Skeleton className={`w-1 h-6 rounded-full ${boneBase}`} />
          <Skeleton className={`h-5 w-44 rounded-lg ${boneBase}`} />
        </View>

        {/* Card skeletons (overflow-hidden clips to the viewport) */}
        <View className="flex-row gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <View key={i} className={`rounded-2xl overflow-hidden flex-shrink-0 ${boneBase}`} style={card}>
              {/* Image area */}
              <Skeleton className={`${imageClass} ${boneBase}`} />
              {/* Content body */}
              <View className="p-3 gap-2">
                <Skeleton className={`h-3 w-16 rounded ${boneBase}`} />
                <Skeleton className={`h-4 w-40 rounded ${boneBase}`} />
                <Skeleton className={`h-3 w-full rounded ${boneBase}`} />
                <Skeleton className={`h-3 w-2/3 rounded ${boneBase}`} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
