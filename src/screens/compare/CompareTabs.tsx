/**
 * CompareTabs — Programs | Institutions tab switcher for the Compare screen.
 *
 * Thin orchestrator: owns the active-tab state, renders the tab bar, and
 * delegates to ProgramsCompareTab / InstitutionsCompareTab (from Profile)
 * without any duplication.
 *
 * Split from CompareScreen to keep both files under ~300 lines.
 */

import { useState } from "react";
import { ScrollView, View } from "react-native";
import { BookOpen, Building2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCustomTranslation } from "@/hooks/useCustomTranslation";
import { SegmentedPill } from "@/components/common/SegmentedPill";
import { contentColumnStyle } from "@/config/theme";

// Reuse the already-built tabs from Profile — no logic duplication
import { ProgramsCompareTab } from "@/screens/profile/tabs/comparisons/ProgramsCompareTab";
import { InstitutionsCompareTab } from "@/screens/profile/tabs/comparisons/InstitutionsCompareTab";

type CompTab = "programs" | "institutions";

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  initialTab?: CompTab;
}

export function CompareTabs({ initialTab = "programs" }: Props) {
  const { t, isRtl } = useCustomTranslation();
  const [activeTab, setActiveTab] = useState<CompTab>(initialTab);
  // This route has no tab bar: keep the last row clear of the home indicator.
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 + insets.bottom }}
    >
      <View style={contentColumnStyle}>
        {/* Tab bar */}
        <View
          className={`flex-row gap-2 mb-4 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <SegmentedPill
            label={t("programs")}
            icon={BookOpen}
            active={activeTab === "programs"}
            onPress={() => setActiveTab("programs")}
          />
          <SegmentedPill
            label={t("institutions")}
            icon={Building2}
            active={activeTab === "institutions"}
            onPress={() => setActiveTab("institutions")}
          />
        </View>

        {activeTab === "programs" && <ProgramsCompareTab />}
        {activeTab === "institutions" && <InstitutionsCompareTab />}
      </View>
    </ScrollView>
  );
}
