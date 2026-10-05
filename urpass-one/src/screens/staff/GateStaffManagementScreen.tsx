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
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/common/Header";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import type { UserRole } from "../../types";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedGateId: string;
  assignedGateName: string;
  activeScansCount: number;
  status: "active" | "invited" | "offline";
  pinCode: string;
}

const MOCK_STAFF: StaffMember[] = [
  {
    id: "stf-1",
    name: "Alex Gate Supervisor",
    email: "manager@urpass.space",
    role: "event_manager",
    assignedGateId: "gate-a-main",
    assignedGateName: "Gate A – Main Concourse",
    activeScansCount: 420,
    status: "active",
    pinCode: "8821",
  },
  {
    id: "stf-2",
    name: "Kavita Staff",
    email: "kavita@urpass.space",
    role: "gate_staff",
    assignedGateId: "gate-a-main",
    assignedGateName: "Gate A – Main Concourse",
    activeScansCount: 780,
    status: "active",
    pinCode: "4190",
  },
  {
    id: "stf-3",
    name: "Siddharth VIP Host",
    email: "siddharth@urpass.space",
    role: "gate_manager",
    assignedGateId: "gate-b-vip",
    assignedGateName: "Gate B – VIP & Keynote",
    activeScansCount: 195,
    status: "active",
    pinCode: "9012",
  },
  {
    id: "stf-4",
    name: "Ravi Crew Manager",
    email: "ravi@urpass.space",
    role: "gate_staff",
    assignedGateId: "gate-d-staff",
    assignedGateName: "Gate D – Staff Loading",
    activeScansCount: 88,
    status: "offline",
    pinCode: "3310",
  },
];

export function GateStaffManagementScreen({ navigation }: { navigation?: any }) {
  const { gates } = useEvent();
  const { user } = useAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGateId, setNewGateId] = useState(gates[0]?.id || "");
  const [newRole, setNewRole] = useState<UserRole>("gate_staff");

  function handleAddStaff() {
    if (!newName || !newEmail) {
      Alert.alert("Missing Fields", "Please enter staff name and email address.");
      return;
    }

    const assignedGate = gates.find((g) => g.id === newGateId) || gates[0];
    const newMember: StaffMember = {
      id: `stf_${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      assignedGateId: assignedGate.id,
      assignedGateName: assignedGate.name,
      activeScansCount: 0,
      status: "invited",
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    setStaffList((prev) => [newMember, ...prev]);
    setShowAddForm(false);
    setNewName("");
    setNewEmail("");
    Alert.alert("Staff Added", `Invitation & quick PIN (${newMember.pinCode}) generated for ${newName}.`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Gate Staff & Crew Management"
        subtitle="Manage scanner personnel, PIN codes & gate assignments"
        showEventSwitcher={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Summary Bar */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>FIELD OPERATIONS TEAM</Text>
              <Text style={styles.summarySub}>{staffList.length} Registered Crew Members</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddForm((prev) => !prev)}
            >
              <Text style={styles.addBtnText}>+ Add Staff Member</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Add Staff Form Accordion */}
        {showAddForm && (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Add Gate Staff Member</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ramesh Kumar"
              placeholderTextColor={COLORS.textMuted}
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.inputLabel}>Staff Email</Text>
            <TextInput
              style={styles.input}
              placeholder="ramesh@urpass.space"
              placeholderTextColor={COLORS.textMuted}
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Assign Gate</Text>
            <View style={styles.gateSelectRow}>
              {gates.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.gateSelectBtn,
                    newGateId === g.id && styles.gateSelectBtnActive,
                  ]}
                  onPress={() => setNewGateId(g.id)}
                >
                  <Text
                    style={[
                      styles.gateSelectBtnText,
                      newGateId === g.id && styles.gateSelectBtnTextActive,
                    ]}
                  >
                    {g.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Save & Generate Quick PIN"
              onPress={handleAddStaff}
              size="lg"
              style={styles.saveStaffBtn}
            />
          </Card>
        )}

        {/* Staff Members List */}
        <View style={styles.staffList}>
          {staffList.map((member) => (
            <Card key={member.id} style={styles.staffCard}>
              <View style={styles.staffCardTop}>
                <View>
                  <Text style={styles.staffName}>{member.name}</Text>
                  <Text style={styles.staffEmail}>{member.email}</Text>
                </View>
                <Badge
                  label={member.role.replace("_", " ")}
                  variant={member.role === "event_manager" ? "brand" : "neutral"}
                  size="sm"
                />
              </View>

              <View style={styles.staffMetaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Assigned Gate</Text>
                  <Text style={styles.metaVal}>{member.assignedGateName}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Scans Handled</Text>
                  <Text style={styles.metaVal}>{member.activeScansCount}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Quick PIN</Text>
                  <Text style={[styles.metaVal, styles.pinCodeText]}>{member.pinCode}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
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
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  summarySub: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: COLORS.brand,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
    borderColor: COLORS.brand,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    marginBottom: 6,
  },
  gateSelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
    marginBottom: 14,
  },
  gateSelectBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  gateSelectBtnActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  gateSelectBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  gateSelectBtnTextActive: {
    color: COLORS.white,
  },
  saveStaffBtn: {
    marginTop: 8,
  },
  staffList: {
    gap: 10,
  },
  staffCard: {
    padding: 14,
  },
  staffCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  staffName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  staffEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  staffMetaRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  metaVal: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  pinCodeText: {
    fontFamily: "monospace",
    color: COLORS.amber,
    letterSpacing: 1,
  },
});
