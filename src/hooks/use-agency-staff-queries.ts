import { useQuery } from "@tanstack/react-query";
import * as agencyStaffApi from "../api/agency-staff";
import { useAuthStore } from "../stores/auth-store";

export function useStaffList() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["agency", "staff"],
    queryFn: () => agencyStaffApi.listStaff(accessToken!),
    enabled: !!accessToken,
  });
}

export function useStaffAuditLog(staffId: string, cursor?: string, limit?: number) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["agency", "staff", "audit", staffId, cursor],
    queryFn: () => agencyStaffApi.getStaffAuditLog(accessToken!, staffId, cursor, limit),
    enabled: !!accessToken && !!staffId,
  });
}
