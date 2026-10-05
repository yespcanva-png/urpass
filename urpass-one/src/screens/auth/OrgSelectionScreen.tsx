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
} from "react-native";
import { Building2, Search, Ticket } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import { Badge } from "../../components/common/Badge";

interface OrgSelectionScreenProps {
  navigation?: any;
}

export function OrgSelectionScreen({ navigation }: OrgSelectionScreenProps) {
  const { user, logout } = useAuth();
  const { organizations, selectedOrg, selectOrganization, isLoading } = useEvent();
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-skip if only 1 organization is available
  useEffect(() => {
    if (organizations && organizations.length === 1) {
      selectOrganization(organizations[0].id);
      navigation?.navigate("EventSelection");
    }
  }, [organizations]);

  const filteredOrgs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q) ||
        (o.role && o.role.toLowerCase().includes(q))
    );
  }, [organizations, searchQuery]);

  function handleSelectOrg(orgId: string) {
    selectOrganization(orgId);
    navigation?.navigate("EventSelection");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.wordmarkRow}>
          <View style={styles.ticketIconBox}>
            <Ticket size={15} color={COLORS.brand} />
          </View>
          <Text style={styles.wordmarkText}>URPASS</Text>
        </View>

        <TouchableOpacity onPress={() => logout()} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Title & Subtext */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Select organisation</Text>
        <Text style={styles.headerSubtitle}>
          Choose the organisation you want to operate under.
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={16} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search organisations..."
            placeholderTextColor={COLORS.textLightMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Organizations List */}
      <FlatList
        data={filteredOrgs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Building2 size={28} color={COLORS.textLightMuted} />
            <Text style={styles.emptyTitle}>No organisations found</Text>
            <Text style={styles.emptySubtitle}>
              You don't currently have access to an UrPass organisation matching your search. Contact your administrator.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedOrg?.id === item.id;
          const roleLabel = (item.role || user?.role || "Event Manager").replace("_", " ").toUpperCase();

          return (
            <TouchableOpacity
              style={[styles.orgCard, isSelected && styles.orgCardSelected]}
              onPress={() => handleSelectOrg(item.id)}
              activeOpacity={0.82}
            >
              {/* Org Logo / Initials Avatar */}
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>

              {/* Org Info */}
              <View style={styles.infoBox}>
                <Text style={styles.orgName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.roleRow}>
                  <Text style={styles.roleText}>{roleLabel}</Text>
                  {item.eventsCount !== undefined && (
                    <Text style={styles.eventsCountText}>
                      • {item.eventsCount} {item.eventsCount === 1 ? "Event" : "Events"}
                    </Text>
                  )}
                </View>
              </View>

              {/* Right Chevron */}
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorderSubtle,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmarkText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  signOutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  signOutText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    height: "100%",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 10,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 17,
  },
  orgCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  orgCardSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandLight,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.brandLight,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.brand,
  },
  infoBox: {
    flex: 1,
    paddingRight: 8,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brand,
  },
  eventsCountText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    color: COLORS.textLightMuted,
  },
});
