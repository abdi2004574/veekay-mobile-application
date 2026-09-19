import { apiFetch } from "./client";

export interface AgencySettingItem {
  id: string;
  agencyId: string;
  key: string;
  value: any;
  createdAt: string;
  updatedAt: string;
}

export interface AgencySettingsListResponse {
  settings: AgencySettingItem[];
}

export function listAgencySettings(accessToken: string) {
  return apiFetch<AgencySettingsListResponse>("/agency/settings", { accessToken });
}

export function updateAgencySetting(accessToken: string, key: string, value: any) {
  return apiFetch<AgencySettingItem>("/agency/settings", {
    method: "PATCH",
    body: { key, value },
    accessToken,
  });
}
