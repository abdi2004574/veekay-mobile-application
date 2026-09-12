import { Platform } from 'react-native';
import Purchases, {
  type PurchasesConfiguration,
  type PurchasesOfferings,
  type PurchasesPackage,
  type CustomerInfo,
  type PurchasesEntitlementInfo,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';

export type AgencySubscriptionTier = 'basic' | 'premium' | 'featured';

export interface AgencyOfferingPackage {
  readonly identifier: string;
  readonly productIdentifier: string;
  readonly priceString: string;
  readonly price: number;
  readonly currencyCode: string;
  readonly subscriptionPeriod: string | null;
  readonly title: string;
  readonly description: string;
}

export interface AgencyOffering {
  readonly identifier: string;
  readonly description: string;
  readonly packages: AgencyOfferingPackage[];
}

export interface AgencyEntitlement {
  readonly identifier: string;
  readonly isActive: boolean;
  readonly willRenew: boolean;
  readonly latestPurchaseDate: string;
  readonly expirationDate: string | null;
  readonly isSandbox: boolean;
  readonly productIdentifier: string;
}

export interface AgencyCustomerInfo {
  readonly activeEntitlements: AgencyEntitlement[];
  readonly activeSubscriptions: string[];
  readonly allPurchasedProductIdentifiers: string[];
  readonly latestExpirationDate: string | null;
  readonly originalAppUserId: string;
  readonly managementURL: string | null;
  readonly requestDate: string;
}

export interface PurchaseResult {
  readonly productIdentifier: string;
  readonly customerInfo: AgencyCustomerInfo;
}

export class RevenueCatError extends Error {
  constructor(
    public readonly code: PURCHASES_ERROR_CODE | string,
    message: string,
  ) {
    super(message);
    this.name = 'RevenueCatError';
  }
}

export type RevenueCatState = 'idle' | 'loading' | 'ready' | 'error' | 'unavailable';

export function isRevenueCatAvailable(): boolean {
  return Platform.OS !== 'web';
}

function getApiKey(): string | undefined {
  const platformKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS
      : Platform.OS === 'android'
        ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID
        : undefined;
  return platformKey;
}

function toAgencyPackage(pkg: PurchasesPackage): AgencyOfferingPackage {
  const product = pkg.product;
  return {
    identifier: pkg.identifier,
    productIdentifier: product.identifier,
    priceString: product.priceString,
    price: product.price,
    currencyCode: product.currencyCode,
    subscriptionPeriod: product.subscriptionPeriod,
    title: product.title,
    description: product.description,
  };
}

function toAgencyEntitlement(info: PurchasesEntitlementInfo): AgencyEntitlement {
  return {
    identifier: info.identifier,
    isActive: info.isActive,
    willRenew: info.willRenew,
    latestPurchaseDate: info.latestPurchaseDate,
    expirationDate: info.expirationDate,
    isSandbox: info.isSandbox,
    productIdentifier: info.productIdentifier,
  };
}

function toAgencyCustomerInfo(info: CustomerInfo): AgencyCustomerInfo {
  const activeEntitlements = Object.values(info.entitlements.active).map(toAgencyEntitlement);
  return {
    activeEntitlements,
    activeSubscriptions: [...info.activeSubscriptions],
    allPurchasedProductIdentifiers: [...info.allPurchasedProductIdentifiers],
    latestExpirationDate: info.latestExpirationDate,
    originalAppUserId: info.originalAppUserId,
    managementURL: info.managementURL,
    requestDate: info.requestDate,
  };
}

function wrapError(err: unknown): RevenueCatError {
  if (err instanceof RevenueCatError) return err;
  const code =
    err && typeof err === 'object' && 'code' in err
      ? (err as { code: string }).code
      : PURCHASES_ERROR_CODE.UNKNOWN_ERROR;
  const message =
    err && typeof err === 'object' && 'message' in err
      ? (err as { message: string }).message
      : 'Unexpected RevenueCat error';
  return new RevenueCatError(code, message);
}

let initialized = false;
let configuredAppUserID: string | undefined;
let configurationQueue: Promise<void> = Promise.resolve();

async function configureCurrentSession(apiKey: string, appUserID?: string): Promise<void> {
  if (initialized && configuredAppUserID === appUserID) {
    return;
  }

  try {
    if (!initialized) {
      const config: PurchasesConfiguration = {
        apiKey,
        ...(appUserID ? { appUserID } : {}),
      };
      Purchases.configure(config);
      initialized = true;
    }

    if (appUserID) {
      await Purchases.logIn(appUserID);
    } else if (configuredAppUserID !== undefined) {
      await Purchases.logOut();
    }

    configuredAppUserID = appUserID;
  } catch (err) {
    throw wrapError(err);
  }
}

export function configureRevenueCat(appUserID?: string): Promise<void> {
  if (!isRevenueCatAvailable()) {
    return Promise.resolve();
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return Promise.reject(
      new RevenueCatError(
        PURCHASES_ERROR_CODE.INVALID_CREDENTIALS_ERROR,
        'RevenueCat API key not configured. Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS and _ANDROID in .env.',
      ),
    );
  }

  const operation = configurationQueue.then(() => configureCurrentSession(apiKey, appUserID));
  configurationQueue = operation.catch(() => undefined);
  return operation;
}

export function isRevenueCatConfigured(): boolean {
  return initialized;
}

export async function loadOfferings(): Promise<AgencyOffering | null> {
  if (!isRevenueCatAvailable()) return null;

  try {
    const offerings: PurchasesOfferings = await Purchases.getOfferings();
    if (!offerings.current) return null;

    return {
      identifier: offerings.current.identifier,
      description: offerings.current.serverDescription,
      packages: offerings.current.availablePackages.map(toAgencyPackage),
    };
  } catch (err) {
    throw wrapError(err);
  }
}

export async function purchasePackage(packageId: string): Promise<PurchaseResult> {
  if (!isRevenueCatAvailable()) {
    throw new RevenueCatError(
      PURCHASES_ERROR_CODE.UNSUPPORTED_ERROR,
      'RevenueCat is not available on this platform.',
    );
  }

  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;
    if (!offering) {
      throw new RevenueCatError(
        PURCHASES_ERROR_CODE.UNKNOWN_ERROR,
        'No offerings available from RevenueCat.',
      );
    }

    const pkg = offering.availablePackages.find((p) => p.identifier === packageId);
    if (!pkg) {
      throw new RevenueCatError(
        PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR,
        `Package "${packageId}" not found in current offering.`,
      );
    }

    const result = await Purchases.purchasePackage(pkg);
    return {
      productIdentifier: result.productIdentifier,
      customerInfo: toAgencyCustomerInfo(result.customerInfo),
    };
  } catch (err) {
    throw wrapError(err);
  }
}

export async function restorePurchases(): Promise<AgencyCustomerInfo> {
  if (!isRevenueCatAvailable()) {
    throw new RevenueCatError(
      PURCHASES_ERROR_CODE.UNSUPPORTED_ERROR,
      'RevenueCat is not available on this platform.',
    );
  }

  try {
    const info = await Purchases.restorePurchases();
    return toAgencyCustomerInfo(info);
  } catch (err) {
    throw wrapError(err);
  }
}

export async function getCustomerInfo(): Promise<AgencyCustomerInfo> {
  if (!isRevenueCatAvailable()) {
    throw new RevenueCatError(
      PURCHASES_ERROR_CODE.UNSUPPORTED_ERROR,
      'RevenueCat is not available on this platform.',
    );
  }

  try {
    const info = await Purchases.getCustomerInfo();
    return toAgencyCustomerInfo(info);
  } catch (err) {
    throw wrapError(err);
  }
}

export async function logOutRevenueCat(): Promise<void> {
  if (!isRevenueCatAvailable() || !initialized) return;

  try {
    await Purchases.logOut();
    initialized = false;
    configuredAppUserID = undefined;
  } catch {
    // Best-effort logout - ignore errors during cleanup.
  }
}

Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
  if (__DEV__) {
    console.log('[RevenueCat] Customer info updated:', {
      activeEntitlements: Object.keys(info.entitlements.active),
      originalAppUserId: info.originalAppUserId,
    });
  }
});

export const TIER_PACKAGE_MAP: Record<string, AgencySubscriptionTier> = {
  basic: 'basic',
  premium: 'premium',
  featured: 'featured',
  agency_basic: 'basic',
  agency_premium: 'premium',
  agency_featured: 'featured',
  'com.veakay.agency.basic': 'basic',
  'com.veakay.agency.premium': 'premium',
  'com.veakay.agency.featured': 'featured',
  'prod-basic': 'basic',
  'prod-premium': 'premium',
  'prod-featured': 'featured',
};

type PackageIdentifierSource =
  | string
  | Pick<AgencyOfferingPackage, 'identifier' | 'productIdentifier'>;

export function mapPackageToTier(
  packageSource: PackageIdentifierSource,
): AgencySubscriptionTier | undefined {
  if (typeof packageSource === 'string') {
    return TIER_PACKAGE_MAP[packageSource];
  }

  return (
    TIER_PACKAGE_MAP[packageSource.identifier] ??
    TIER_PACKAGE_MAP[packageSource.productIdentifier]
  );
}

export function mapEntitlementToTier(entitlementId: string): AgencySubscriptionTier | undefined {
  if (entitlementId === 'basic' || entitlementId === 'premium' || entitlementId === 'featured') {
    return entitlementId;
  }
  return undefined;
}

export function getActiveTierFromCustomerInfo(
  info: AgencyCustomerInfo,
): AgencySubscriptionTier | null {
  for (const entitlement of info.activeEntitlements) {
    if (entitlement.isActive) {
      const tier = mapEntitlementToTier(entitlement.identifier);
      if (tier) return tier;
    }
  }
  return null;
}

export function __resetInitializedForTesting(): void {
  initialized = false;
  configuredAppUserID = undefined;
  configurationQueue = Promise.resolve();
}
