import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { listAgencySettings, updateAgencySetting } from "../api/agency-settings";
import type { AgencySettingItem, AgencySettingsListResponse } from "../api/agency-settings";

export const AGENCY_SETTINGS_QUERY_KEYS = {
  all: ["agency-settings"] as const,
  list: () => ["agency-settings", "list"] as const,
};

export function useAgencySettings() {
  const { accessToken } = useAuthStore();
  return useQuery<AgencySettingsListResponse>({
    queryKey: AGENCY_SETTINGS_QUERY_KEYS.list(),
    queryFn: () => listAgencySettings(accessToken ?? ""),
    enabled: !!accessToken,
  });
}

export function useUpdateAgencySetting() {
  const { accessToken } = useAuthStore();
  return {
    mutate: (key: string, value: any) => updateAgencySetting(accessToken ?? "", key, value),
  };
}
