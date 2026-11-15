/**
 * CheckoutSkeleton — loading skeleton for the checkout screen.
 * Same order and card shapes as the real content: breadcrumb, session card
 * (image band + title + meta rows), notes, promo, price breakdown, payment.
 */

import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentColumn } from "@/components/shared/ContentColumn";

export function CheckoutSkeleton() {
  return (
    <ContentColumn className="gap-4 p-4">
      {/* Breadcrumb */}
      <Skeleton className="h-3 w-48 bg-muted rounded" />

      {/* Session card */}
      <View className="bg-card rounded-2xl border border-border overflow-hidden">
        <Skeleton className="h-[120px] bg-muted rounded-none" />
        <View className="p-4 gap-3">
          <Skeleton className="h-5 w-3/4 bg-muted rounded" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-1/2 bg-muted rounded" />
          ))}
        </View>
      </View>

      {/* Notes */}
      <Skeleton className="h-40 bg-muted rounded-2xl" />
      {/* Promo code */}
      <Skeleton className="h-28 bg-muted rounded-2xl" />
      {/* Price breakdown */}
      <Skeleton className="h-32 bg-muted rounded-2xl" />
      {/* Payment method */}
      <Skeleton className="h-20 bg-muted rounded-2xl" />
    </ContentColumn>
  );
}
