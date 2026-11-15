/**
 * PriceBreakdown — subtotal, promo discount (if applied), total.
 * All prices via formatCurrency (useLocalization). No hardcoded hex.
 */

import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";
import { useLocalization } from "@/hooks/useLocalization";
import type { CheckoutBooking } from "@/api/bookingsApi";
import type { AppliedPromo } from "@/api/promoCodeApi";

interface PriceBreakdownProps {
  booking: CheckoutBooking;
  localPromo: AppliedPromo | null;
  /** Updated finalPrice after promo remove */
  overrideFinalPrice?: number | null;
}

export function PriceBreakdown({
  booking,
  localPromo,
  overrideFinalPrice,
}: PriceBreakdownProps) {
  const { t, isRtl } = useCustomTranslation();
  const { formatCurrency } = useLocalization();
  const row = `${isRtl ? "flex-row-reverse" : "flex-row"} items-center justify-between gap-3`;

  const currencyCode =
    (booking.currency?.code as "USD" | "LBP") === "LBP" ? "LBP" : "USD";

  // Subtotal: the event discountedPrice (or basePrice if zero/missing)
  const evt = booking.eventTypeId;
  const subtotal =
    evt?.discountedPrice > 0 ? evt.discountedPrice : evt?.basePrice ?? 0;

  // Discount amount
  const hasLocalPromo = localPromo != null && localPromo.discountAmount > 0;
  const hasBookingPromo = !hasLocalPromo && !!booking.appliedPromoCode;
  const discountAmount = hasLocalPromo
    ? localPromo.discountAmount
    : hasBookingPromo
    ? (booking.pricing?.discountAmount ?? 0)
    : 0;

  // Total: priority: localPromo.finalAmount > overrideFinalPrice > booking.finalPrice > subtotal
  const total = hasLocalPromo
    ? localPromo.finalAmount
    : overrideFinalPrice != null
    ? overrideFinalPrice
    : (booking.finalPrice ?? subtotal);

  const fmt = (v: number) => formatCurrency(v, currencyCode);

  return (
    <View className="bg-card rounded-2xl border border-border p-4 gap-3">
      {/* Subtotal */}
      <View className={row}>
        <Text className="text-sm text-muted-foreground shrink">{t("subtotal")}</Text>
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>{fmt(subtotal)}</Text>
      </View>

      {/* Promo discount — §2: discount amount → text-secondary (turquoise) */}
      {discountAmount > 0 && (
        <View className={row}>
          <Text className="text-sm text-muted-foreground shrink">{t("promo")}</Text>
          <Text className="text-sm font-semibold text-secondary" numberOfLines={1}>
            -{fmt(discountAmount)}
          </Text>
        </View>
      )}

      <Divider />

      {/* Total */}
      <View className={row}>
        <Text className="text-base font-bold text-foreground shrink">{t("total")}</Text>
        <Text className="text-lg font-bold text-foreground" numberOfLines={1}>{fmt(total)}</Text>
      </View>
    </View>
  );
}
