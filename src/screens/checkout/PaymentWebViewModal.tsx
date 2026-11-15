/**
 * PaymentWebViewModal — full-screen Modal wrapping the Whish payment WebView.
 * Extracted from OfferingCheckoutScreen to keep that file under ~300 lines.
 *
 * Uses the shared AppHeader with onBack = onClose (router.back() inside a
 * Modal would navigate away from the screen) and renders PaymentWebViewScreen.
 */

import { Modal } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "@/components/shared/AppHeader";
import { useCustomTranslation } from "@/hooks/useCustomTranslation";
import { useColors } from "@/hooks/useColors";
import { PaymentWebViewScreen } from "@/screens/checkout/PaymentWebViewScreen";

interface PaymentWebViewModalProps {
  collectUrl: string | null;
  bookingReference: string;
  onClose: () => void;
}

export function PaymentWebViewModal({
  collectUrl,
  bookingReference,
  onClose,
}: PaymentWebViewModalProps) {
  const { t } = useCustomTranslation();
  const colors = useColors();

  return (
    <Modal
      visible={!!collectUrl}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* A Modal is a new native root: it needs its own provider for the insets. */}
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top", "bottom"]}
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          {/* Header — onBack closes the modal; router.back() inside a Modal navigates routes */}
          <AppHeader title={t("whish_money")} showBack onBack={onClose} />

          {collectUrl ? (
            <PaymentWebViewScreen
              collectUrl={collectUrl}
              bookingReference={bookingReference}
              onClose={onClose}
            />
          ) : null}
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
