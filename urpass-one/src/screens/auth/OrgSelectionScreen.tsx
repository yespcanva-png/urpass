import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import {
  Building2,
  Search,
  ArrowLeft,
  Check,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";

interface OrgSelectionScreenProps {
  navigation?: any;
}

function formatRole(role?: string): string {
  if (!role) return "Event Staff";
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    org_admin: "Organisation Admin",
    event_manager: "Event Administrator",
    gate_manager: "Gate Manager",
    gate_staff: "Event Staff",
    view_only_ops: "Viewer",
  };
  return (
    map[role.toLowerCase()] ||
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function OrgSelectionScreen({ navigation }: OrgSelectionScreenProps) {
  const { user } = useAuth();
  const { organizations, selectedOrg, selectOrganization } = useEvent();
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedOrg?.id || organizations[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-advance if user belongs to only 1 organization
  useEffect(() => {
    if (organizations && organizations.length === 1) {
      selectOrganization(organizations[0].id);
      navigation?.navigate("EventSelection");
    }
  }, [organizations]);

  // Keep selectedId in sync with selectedOrg
  useEffect(() => {
    if (selectedOrg?.id) {
      setSelectedId(selectedOrg.id);
    } else if (organizations.length > 0 && !selectedId) {
      setSelectedId(organizations[0].id);
    }
  }, [selectedOrg, organizations]);

  const sortedAndFilteredOrgs = useMemo(() => {
    let list = [...organizations];
    // Sort selected or active first
    if (selectedId) {
      list.sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q) ||
        (o.role && formatRole(o.role).toLowerCase().includes(q))
    );
  }, [organizations, searchQuery, selectedId]);

  function handleCardPress(orgId: string) {
    setSelectedId(orgId);
  }

  function handleContinue() {
    if (!selectedId) return;
    selectOrganization(selectedId);
    navigation?.navigate("EventSelection");
  }

  function handleGoBack() {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate("SignIn");
    }
  }

  function handleContactAdmin() {
    Alert.alert(
      "Need Access?",
      "Please contact your organisation administrator or event supervisor to receive an invitation to your workspace.",
      [{ text: "OK", style: "default" }]
    );
  }

  function renderStatusBadge(status?: string) {
    if (!status) return null;
    const s = status.toLowerCase();
    let label = "Active";
    let badgeStyle = styles.statusActiveBadge;
    let textStyle = styles.statusActiveText;

    if (s === "suspended") {
      label = "Suspended";
      badgeStyle = styles.statusSuspendedBadge;
      textStyle = styles.statusSuspendedText;
    } else if (s === "pending" || s === "invitation_pending") {
      label = "Invitation Pending";
      badgeStyle = styles.statusPendingBadge;
      textStyle = styles.statusPendingText;
    }

    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        <Text style={[styles.statusText, textStyle]}>{label}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FC" />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.topBarSpacer} />
      </View>

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconCircleBadge}>
          <Building2 size={22} color="#6D28D9" strokeWidth={2.2} />
        </View>
        <Text style={styles.headerTitle}>Select organisation</Text>
        <Text style={styles.headerSubtitle}>
          Choose the organisation you want to operate under.
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={16} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search organisations..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Organisation Cards List */}
      <FlatList
        data={sortedAndFilteredOrgs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBadge}>
              <Building2 size={24} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No organisations found</Text>
            <Text style={styles.emptySubtitle}>
              You don&apos;t currently have access to an organisation matching your search.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedId === item.id;
          const roleText = formatRole(item.role || user?.role);

          return (
            <TouchableOpacity
              style={[
                styles.orgCard,
                isSelected && styles.orgCardSelected,
              ]}
              onPress={() => handleCardPress(item.id)}
              activeOpacity={0.88}
            >
              {/* Organisation Logo / Avatar */}
              <View
                style={[
                  styles.avatarBox,
                  isSelected && styles.avatarBoxSelected,
                ]}
              >
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* Organisation Details */}
              <View style={styles.infoBox}>
                <View style={styles.nameRow}>
                  <Text
                    style={[
                      styles.orgName,
                      isSelected && styles.orgNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {renderStatusBadge(item.status)}
                </View>
                <Text style={styles.roleText} numberOfLines={1}>
                  {roleText}
                </Text>
              </View>

              {/* Selection / Chevron Indicator */}
              <View style={styles.actionIndicator}>
                {isSelected ? (
                  <View style={styles.checkCircle}>
                    <Check size={13} color="#6D28D9" strokeWidth={2.8} />
                  </View>
                ) : (
                  <ChevronRight size={18} color="#CBD5E1" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedId && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedId}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.continueButtonText,
              !selectedId && styles.continueButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactAdminButton}
          onPress={handleContactAdmin}
          activeOpacity={0.7}
        >
          <Text style={styles.contactAdminText}>
            Can’t find your organisation?{" "}
            <Text style={styles.contactAdminLink}>Contact your administrator</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarSpacer: {
    width: 36,
  },

  /* Header Section */
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  iconCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  /* Search Bar */
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    height: "100%",
  },

  /* Cards List */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  orgCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  orgCardSelected: {
    backgroundColor: "#FAF5FF",
    borderWidth: 1.5,
    borderColor: "#6D28D9",
    shadowColor: "#6D28D9",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarBoxSelected: {
    backgroundColor: "#F3E8FF",
    borderColor: "#DDD6FE",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6D28D9",
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  orgNameSelected: {
    color: "#0F172A",
  },
  roleText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
  },

  /* Status Badges */
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  statusActiveBadge: {
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
  },
  statusActiveText: {
    color: "#059669",
  },
  statusSuspendedBadge: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  statusSuspendedText: {
    color: "#DC2626",
  },
  statusPendingBadge: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FEF3C7",
  },
  statusPendingText: {
    color: "#D97706",
  },

  /* Action Indicator */
  actionIndicator: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FAF5FF",
    borderWidth: 1.5,
    borderColor: "#6D28D9",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Empty State */
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    marginTop: 12,
  },
  emptyIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 28 : 18,
  },
  continueButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#6D28D9",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  continueButtonTextDisabled: {
    color: "#94A3B8",
  },
  contactAdminButton: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  contactAdminText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  contactAdminLink: {
    fontWeight: "600",
    color: "#6D28D9",
  },
});
