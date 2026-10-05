import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useEvent } from "../../context/EventContext";
import { Header } from "../../components/common/Header";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import type { Gate, GateMode, PassType } from "../../types";

const ALL_PASS_TYPES: PassType[] = [
  "participant",
  "vip",
  "speaker",
  "staff",
  "exhibitor",
  "sponsor",
  "student",
  "delegate",
];

interface GateManagementScreenProps {
  navigation?: any;
}

export function GateManagementScreen({ navigation }: GateManagementScreenProps) {
  const { gates, assignedGate, toggleGateStatus, updateGateMode } = useEvent();
  const [selectedGate, setSelectedGate] = useState<Gate>(assignedGate || gates[0]);
  const [capacityInput, setCapacityInput] = useState<string>(
    selectedGate?.capacity ? selectedGate.capacity.toString() : "2000"
  );
  const [allowedPasses, setAllowedPasses] = useState<string[]>(
    selectedGate?.allowedBadgeTypes || ["participant", "vip", "speaker", "delegate"]
  );

  function handleSelectGate(gate: Gate) {
    setSelectedGate(gate);
    setCapacityInput(gate.capacity ? gate.capacity.toString() : "2000");
    setAllowedPasses(gate.allowedBadgeTypes || ["participant", "vip"]);
  }

  function togglePassType(type: PassType) {
    setAllowedPasses((prev) =>
      prev.includes(type) ? prev.filter((p) => p !== type) : [...prev, type]
    );
  }

  function handleSaveGateConfig() {
    Alert.alert("Gate Rules Updated", `Access rules updated for ${selectedGate.name}.`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Gate Access Rules & Config"
        subtitle="Manage gate modes, pass whitelists & capacity"
        showEventSwitcher={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Gate Selector Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {gates.map((g) => {
            const isSelected = selectedGate?.id === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.gateTab, isSelected && styles.gateTabActive]}
                onPress={() => handleSelectGate(g)}
              >
                <Text style={[styles.gateTabText, isSelected && styles.gateTabTextActive]}>
                  {g.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Gate Editor */}
        <Card style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>{selectedGate.name}</Text>
              <Text style={styles.cardSubtitle}>Zone: {selectedGate.zoneName || "Main Area"}</Text>
            </View>
            <Badge
              label={selectedGate.status.toUpperCase()}
              variant={selectedGate.status === "open" ? "green" : "red"}
            />
          </View>

          {/* Mode Configuration */}
          <Text style={styles.fieldLabel}>GATE FLOW DIRECTION MODE</Text>
          <View style={styles.modeButtonsRow}>
            {(["entry", "exit", "both"] as GateMode[]).map((mode) => {
              const isActive = selectedGate.mode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[styles.modeBtn, isActive && styles.modeBtnActive]}
                  onPress={() => updateGateMode(selectedGate.id, mode)}
                >
                  <Text style={[styles.modeBtnText, isActive && styles.modeBtnTextActive]}>
                    {mode === "entry" ? "↓ Entry Only" : mode === "exit" ? "↑ Exit Only" : "⇅ Entry + Exit"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Gate Capacity Limit */}
          <Text style={styles.fieldLabel}>GATE CAPACITY CEILING</Text>
          <TextInput
            style={styles.input}
            value={capacityInput}
            onChangeText={setCapacityInput}
            keyboardType="number-pad"
            placeholder="e.g. 3500"
            placeholderTextColor={COLORS.textMuted}
          />
          <Text style={styles.helpText}>
            Scanner will trigger an amber/red warning when gate throughput exceeds this limit.
          </Text>

          {/* Allowed Pass Whitelist */}
          <Text style={styles.fieldLabel}>ALLOWED PASS TYPES & TIERS</Text>
          <Text style={styles.helpText}>
            Only attendees with checked pass categories will be granted green entry at this gate:
          </Text>

          <View style={styles.passTypesGrid}>
            {ALL_PASS_TYPES.map((type) => {
              const isChecked = allowedPasses.includes(type);
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.passTypeItem, isChecked && styles.passTypeItemChecked]}
                  onPress={() => togglePassType(type)}
                >
                  <Text style={[styles.checkboxIcon, isChecked && styles.checkboxIconChecked]}>
                    {isChecked ? "☑" : "☐"}
                  </Text>
                  <Text style={[styles.passTypeText, isChecked && styles.passTypeTextChecked]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Save Button */}
          <Button
            title="Save Gate Access Rules"
            onPress={handleSaveGateConfig}
            size="lg"
            style={styles.saveBtn}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabScroll: {
    marginBottom: 16,
  },
  gateTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginRight: 8,
  },
  gateTabActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  gateTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  gateTabTextActive: {
    color: COLORS.white,
  },
  formCard: {
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 6,
  },
  modeButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: "center",
  },
  modeBtnActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  modeBtnTextActive: {
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  helpText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 15,
  },
  passTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  passTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  passTypeItemChecked: {
    borderColor: COLORS.brand,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  checkboxIcon: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  checkboxIconChecked: {
    color: COLORS.brand,
  },
  passTypeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  passTypeTextChecked: {
    color: COLORS.textPrimary,
  },
  saveBtn: {
    marginTop: 8,
  },
});
