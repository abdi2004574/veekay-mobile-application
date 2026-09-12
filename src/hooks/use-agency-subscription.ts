import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PURCHASES_ERROR_CODE } from "react-native-purchases";
import { useMyAgency } from "./use-agencies-queries";
import { useAuthStore } from "../stores/auth-store";
import { useToastStore } from "../stores/toast-store";
import { friendlyErrorMessage } from "../utils/error-message";
import {
  configureRevenueCat,
  isRevenueCatAvailable,
  isRevenueCatConfigured,
  loadOfferings,
  purchasePackage as revenueCatPurchasePackage,
  restorePurchases,
  getCustomerInfo,
  mapPackageToTier,
  getActiveTierFromCustomerInfo,
  RevenueCatError,
  type AgencyCustomerInfo,
  type AgencyOffering,
  type AgencyOfferingPackage,
  type AgencySubscriptionTier,
} from "../services/revenue-cat";

export type {
  AgencyCustomerInfo,
  AgencyOffering,
  AgencyOfferingPackage,
  AgencySubscriptionTier,
};

export { mapPackageToTier, RevenueCatError };

export interface AgencySubscriptionResult {
  isAvailable: boolean;
  isLoading: boolean;
  isConfiguring: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  offerings: AgencyOffering | null;
  customerInfo: AgencyCustomerInfo | null;
  currentTier: AgencySubscriptionTier;
  backendTier: AgencySubscriptionTier | null;
  error: string | null;
  purchase: (pkg: AgencyOfferingPackage) => void;
  restore: () => void;
  refetch: () => void;
}

export function useAgencySubscription(): AgencySubscriptionResult {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const showToast = useToastStore((s) => s.show);
  const queryClient = useQueryClient();

  const isAvailable = isRevenueCatAvailable();
  const enabled = isAvailable && !!accessToken;

  const myAgencyQuery = useMyAgency();

  const configureQuery = useQuery({
    queryKey: ["revenuecat", "config", user?.id],
    queryFn: () => {
      if (!user) throw new Error("Not authenticated");
      return configureRevenueCat(user.id);
    },
    enabled,
    retry: false,
    staleTime: Infinity,
  });

  const offeringsQuery = useQuery({
    queryKey: ["revenuecat", "offerings", user?.id],
    queryFn: () => loadOfferings(),
    enabled: enabled && configureQuery.isSuccess && isRevenueCatConfigured(),
    retry: false,
  });

  const customerInfoQuery = useQuery({
    queryKey: ["revenuecat", "customer-info", user?.id],
    queryFn: () => getCustomerInfo(),
    enabled: enabled && configureQuery.isSuccess && isRevenueCatConfigured(),
    retry: false,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: AgencyOfferingPackage) => {
      const result = await revenueCatPurchasePackage(pkg.identifier);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "me"] });
      queryClient.invalidateQueries({ queryKey: ["revenuecat", "customer-info", user?.id] });
      showToast("Subscription updated successfully.");
    },
    onError: (err: unknown) => {
      if (isPurchaseCancelledError(err)) return;
      const message = err instanceof RevenueCatError ? err.message : friendlyErrorMessage(err);
      showToast(message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => restorePurchases(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "me"] });
      queryClient.invalidateQueries({ queryKey: ["revenuecat", "customer-info", user?.id] });
      showToast("Purchases restored.");
    },
    onError: (err: unknown) => {
      if (isPurchaseCancelledError(err)) return;
      const message = err instanceof RevenueCatError ? err.message : friendlyErrorMessage(err);
      showToast(message);
    },
  });

  const activeTier = customerInfoQuery.data ? getActiveTierFromCustomerInfo(customerInfoQuery.data) : null;
  const currentTier = activeTier ?? myAgencyQuery.data?.subscriptionTier ?? "basic";
  const backendTier = myAgencyQuery.data?.subscriptionTier ?? null;
  const isConfiguring = configureQuery.isPending || configureQuery.isLoading;
  const configureError = configureQuery.error;
  const error = configureError ? formatError(configureError) : null;
  const isLoading = isConfiguring || (enabled && (offeringsQuery.isLoading || customerInfoQuery.isLoading));

  return {
    isAvailable,
    isLoading,
    isConfiguring,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
    offerings: offeringsQuery.data ?? null,
    customerInfo: customerInfoQuery.data ?? null,
    currentTier,
    backendTier,
    error,
    purchase: (pkg: AgencyOfferingPackage) => purchaseMutation.mutate(pkg),
    restore: () => restoreMutation.mutate(),
    refetch: () => {
      configureQuery.refetch();
      offeringsQuery.refetch();
      customerInfoQuery.refetch();
      myAgencyQuery.refetch();
    },
  };
}

function isPurchaseCancelledError(err: unknown): boolean {
  if (err instanceof RevenueCatError) {
    return err.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
  }
  return false;
}

function formatError(err: unknown): string | null {
  if (err instanceof RevenueCatError) return err.message;
  if (err instanceof Error) return err.message;
  return String(err);
}
