import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import Purchases, { PURCHASES_ERROR_CODE } from "react-native-purchases";
import {
  isRevenueCatAvailable,
  configureRevenueCat,
  __resetInitializedForTesting,
  loadOfferings,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  RevenueCatError,
  mapPackageToTier,
  mapEntitlementToTier,
  getActiveTierFromCustomerInfo,
} from "./revenue-cat";

const mockPurchases = Purchases as unknown as Record<string, any>;

describe("isRevenueCatAvailable", () => {
  it("returns true on native platforms (jest default is ios)", () => {
    expect(isRevenueCatAvailable()).toBe(true);
  });
});

describe("configureRevenueCat", () => {
  const originalKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS;

  beforeEach(() => {
    __resetInitializedForTesting();
    mockPurchases.configure.mockClear();
    mockPurchases.logIn.mockClear();
  });

  afterEach(() => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = originalKey;
  });

  it("throws RevenueCatError when API key is missing", async () => {
    delete process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS;
    let error: unknown;
    try {
      await configureRevenueCat();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toMatch(/API key not configured/);
  });

  it("calls Purchases.configure with apiKey and appUserID", async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = "test-api-key";
    await configureRevenueCat("test-user-id");
    expect(mockPurchases.configure).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: "test-api-key" }),
    );
    expect(mockPurchases.logIn).toHaveBeenCalledWith("test-user-id");
  });

  it("does not call logIn when appUserID is not provided", async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = "test-api-key";
    await configureRevenueCat();
    expect(mockPurchases.logIn).not.toHaveBeenCalled();
  });

  it("does not reconfigure or log in again for the same appUserID", async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = "test-api-key";
    await configureRevenueCat("user-one");
    mockPurchases.configure.mockClear();
    mockPurchases.logIn.mockClear();

    await configureRevenueCat("user-one");

    expect(mockPurchases.configure).not.toHaveBeenCalled();
    expect(mockPurchases.logIn).not.toHaveBeenCalled();
  });

  it("switches to a changed appUserID without reconfiguring", async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = "test-api-key";
    await configureRevenueCat("user-one");
    mockPurchases.configure.mockClear();
    mockPurchases.logIn.mockClear();

    await configureRevenueCat("user-two");

    expect(mockPurchases.configure).not.toHaveBeenCalled();
    expect(mockPurchases.logIn).toHaveBeenCalledWith("user-two");
  });

  it("logs out when the configured appUserID is removed", async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = "test-api-key";
    await configureRevenueCat("user-one");
    mockPurchases.configure.mockClear();
    mockPurchases.logIn.mockClear();
    mockPurchases.logOut.mockClear();

    await configureRevenueCat();

    expect(mockPurchases.configure).not.toHaveBeenCalled();
    expect(mockPurchases.logOut).toHaveBeenCalledWith();
  });

  it("throws RevenueCatError when configure fails", async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS = "test-api-key";
    mockPurchases.configure.mockImplementationOnce(() => {
      throw { code: PURCHASES_ERROR_CODE.INVALID_CREDENTIALS_ERROR, message: "Bad key" };
    });
    let error: unknown;
    try {
      await configureRevenueCat("user-id");
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).code).toBe(PURCHASES_ERROR_CODE.INVALID_CREDENTIALS_ERROR);
  });
});

describe("loadOfferings", () => {
  beforeEach(() => {
    mockPurchases.getOfferings.mockClear();
  });

  it("maps RevenueCat offerings to AgencyOffering", async () => {
    const offering = await loadOfferings();
    expect(offering).not.toBeNull();
    expect(offering!.identifier).toBe("default");
    expect(offering!.description).toBe("Agency Subscription");
    expect(offering!.packages).toHaveLength(1);
    expect(offering!.packages[0].identifier).toBe("basic");
    expect(offering!.packages[0].priceString).toBe("Free");
    expect(offering!.packages[0].currencyCode).toBe("USD");
  });

  it("returns null when no current offering", async () => {
    mockPurchases.getOfferings.mockImplementationOnce(() =>
      Promise.resolve({ all: {}, current: null })
    );
    const result = await loadOfferings();
    expect(result).toBeNull();
  });

  it("throws RevenueCatError on failure", async () => {
    mockPurchases.getOfferings.mockImplementationOnce(() =>
      Promise.reject(new Error("Network failure"))
    );
    let error: unknown;
    try {
      await loadOfferings();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toBe("Network failure");
  });
});

describe("purchasePackage", () => {
  beforeEach(() => {
    mockPurchases.purchasePackage.mockClear();
    mockPurchases.getOfferings.mockClear();
  });

  it("returns PurchaseResult with mapped customer info", async () => {
    const result = await purchasePackage("basic");
    expect(result.productIdentifier).toBe("com.veakay.agency.basic");
    expect(result.customerInfo.originalAppUserId).toBe("test-user-id");
  });

  it("throws RevenueCatError when offering is not found", async () => {
    mockPurchases.getOfferings.mockImplementationOnce(() =>
      Promise.resolve({ all: {}, current: null })
    );
    let error: unknown;
    try {
      await purchasePackage("basic");
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toMatch(/No offerings/);
  });

  it("throws RevenueCatError when package is not found", async () => {
    mockPurchases.getOfferings.mockImplementationOnce(() =>
      Promise.resolve({ all: {}, current: { availablePackages: [] } })
    );
    let error: unknown;
    try {
      await purchasePackage("nonexistent");
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toMatch(/not found/);
  });

  it("wraps RevenueCat purchase cancelled errors", async () => {
    mockPurchases.purchasePackage.mockImplementationOnce(() =>
      Promise.reject({
        code: PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR,
        message: "Purchase cancelled by user",
      })
    );
    let error: unknown;
    try {
      await purchasePackage("basic");
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
  });

  it("wraps RevenueCat entitlement expired errors", async () => {
    mockPurchases.getOfferings.mockImplementationOnce(() =>
      Promise.resolve({ all: {}, current: { availablePackages: [{ identifier: "premium" }] } })
    );
    mockPurchases.purchasePackage.mockImplementationOnce(() =>
      Promise.reject({
        code: PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR,
        message: "Entitlement expired",
      })
    );
    let error: unknown;
    try {
      await purchasePackage("premium");
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toBe("Entitlement expired");
  });

  it("throws RevenueCatError on unexpected errors", async () => {
    mockPurchases.getOfferings.mockImplementationOnce(() =>
      Promise.resolve({ all: {}, current: { availablePackages: [{ identifier: "basic" }] } })
    );
    mockPurchases.purchasePackage.mockImplementationOnce(() =>
      Promise.reject(new Error("Unexpected error"))
    );
    let error: unknown;
    try {
      await purchasePackage("basic");
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toBe("Unexpected error");
  });
});

describe("restorePurchases", () => {
  it("returns mapped customer info", async () => {
    const info = await restorePurchases();
    expect(info.originalAppUserId).toBe("test-user-id");
    expect(info.activeEntitlements).toEqual([]);
  });

  it("throws RevenueCatError on failure", async () => {
    mockPurchases.restorePurchases.mockImplementationOnce(() =>
      Promise.reject({
        code: PURCHASES_ERROR_CODE.NETWORK_ERROR,
        message: "Network error",
      })
    );
    let error: unknown;
    try {
      await restorePurchases();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
  });
});

describe("getCustomerInfo", () => {
  it("returns mapped customer info", async () => {
    const info = await getCustomerInfo();
    expect(info.originalAppUserId).toBe("test-user-id");
    expect(info.activeSubscriptions).toEqual([]);
    expect(info.latestExpirationDate).toBeNull();
  });

  it("throws RevenueCatError on failure", async () => {
    mockPurchases.getCustomerInfo.mockImplementationOnce(() =>
      Promise.reject(new Error("Fetch failed"))
    );
    let error: unknown;
    try {
      await getCustomerInfo();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(RevenueCatError);
    expect((error as RevenueCatError).message).toBe("Fetch failed");
  });
});

describe("RevenueCatError", () => {
  it("creates error with code and message", () => {
    const err = new RevenueCatError("test_code", "something went wrong");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("RevenueCatError");
    expect(err.code).toBe("test_code");
    expect(err.message).toBe("something went wrong");
  });

  it("creates error with PURCHASES_ERROR_CODE enum", () => {
    const err = new RevenueCatError(
      PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR,
      "cancelled",
    );
    expect(err.code).toBe(PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR);
    expect(err.code).toBe("1");
  });
});

describe("mapPackageToTier", () => {
  it("maps 'basic' to 'basic'", () => {
    expect(mapPackageToTier("basic")).toBe("basic");
  });

  it("maps 'premium' to 'premium'", () => {
    expect(mapPackageToTier("premium")).toBe("premium");
  });

  it("maps 'featured' to 'featured'", () => {
    expect(mapPackageToTier("featured")).toBe("featured");
  });

  it("maps 'agency_basic' to 'basic'", () => {
    expect(mapPackageToTier("agency_basic")).toBe("basic");
  });

  it("maps 'agency_premium' to 'premium'", () => {
    expect(mapPackageToTier("agency_premium")).toBe("premium");
  });

  it("maps 'agency_featured' to 'featured'", () => {
    expect(mapPackageToTier("agency_featured")).toBe("featured");
  });

  it("maps a known productIdentifier when the package identifier is unknown", () => {
    expect(
      mapPackageToTier({
        identifier: "monthly",
        productIdentifier: "com.veakay.agency.premium",
      }),
    ).toBe("premium");
  });

  it("returns undefined when neither package identifier is known", () => {
    expect(
      mapPackageToTier({
        identifier: "unknown_package",
        productIdentifier: "unknown.product",
      }),
    ).toBeUndefined();
  });

  it("returns undefined for unknown package", () => {
    expect(mapPackageToTier("unknown_package")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(mapPackageToTier("")).toBeUndefined();
  });
});

describe("mapEntitlementToTier", () => {
  it("maps 'basic' entitlement to 'basic'", () => {
    expect(mapEntitlementToTier("basic")).toBe("basic");
  });

  it("maps 'premium' entitlement to 'premium'", () => {
    expect(mapEntitlementToTier("premium")).toBe("premium");
  });

  it("maps 'featured' entitlement to 'featured'", () => {
    expect(mapEntitlementToTier("featured")).toBe("featured");
  });

  it("returns undefined for unknown entitlement", () => {
    expect(mapEntitlementToTier("premium_entitlement")).toBeUndefined();
  });

  it("returns undefined for entitlement with prefix", () => {
    expect(mapEntitlementToTier("premium:basic")).toBeUndefined();
  });
});

describe("getActiveTierFromCustomerInfo", () => {
  it("returns tier from active entitlement", () => {
    const info = {
      activeEntitlements: [
        { identifier: "premium", isActive: true } as any,
      ],
    };
    expect(getActiveTierFromCustomerInfo(info as any)).toBe("premium");
  });

  it("returns null when no active entitlements", () => {
    const info = {
      activeEntitlements: [],
    };
    expect(getActiveTierFromCustomerInfo(info as any)).toBeNull();
  });

  it("returns null when active entitlement is unknown", () => {
    const info = {
      activeEntitlements: [
        { identifier: "unknown_entitlement", isActive: true } as any,
      ],
    };
    expect(getActiveTierFromCustomerInfo(info as any)).toBeNull();
  });

  it("returns first active entitlement tier when multiple", () => {
    const info = {
      activeEntitlements: [
        { identifier: "basic", isActive: true } as any,
        { identifier: "premium", isActive: true } as any,
      ],
    };
    expect(getActiveTierFromCustomerInfo(info as any)).toBe("basic");
  });

  it("skips inactive entitlements", () => {
    const info = {
      activeEntitlements: [
        { identifier: "premium", isActive: false } as any,
        { identifier: "basic", isActive: true } as any,
      ],
    };
    expect(getActiveTierFromCustomerInfo(info as any)).toBe("basic");
  });

  it("returns null when active entitlement is inactive and unknown", () => {
    const info = {
      activeEntitlements: [
        { identifier: "unknown", isActive: false } as any,
      ],
    };
    expect(getActiveTierFromCustomerInfo(info as any)).toBeNull();
  });
});
