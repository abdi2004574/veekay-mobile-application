const { jest: mockJest } = require('@jest/globals');

mockJest.mock('react-native-reanimated', () => mockJest.requireActual('react-native-reanimated/mock'));

mockJest.mock('expo-router', () => {
  const React = mockJest.requireActual('react');
  const noop = mockJest.fn();
  const Link = ({ children }) => React.createElement(React.Fragment, null, children);

  return {
    Link,
    Redirect: () => null,
    Stack: () => null,
    Tabs: () => null,
    Slot: () => null,
    router: {
      navigate: noop,
      replace: noop,
      push: noop,
      back: noop,
      canGoBack: () => false,
      setParams: noop,
      preload: noop,
    },
    useNavigation: () => ({
      navigate: noop,
      dispatch: noop,
      goBack: noop,
      reset: noop,
      setOptions: noop,
      addListener: noop,
    }),
    useSegments: () => [],
    useParams: () => ({}),
    usePathname: () => '/',
    useFocusedRoute: () => null,
    useRootNavigationState: () => ({ }),
    withLayoutContext: (navigation) => navigation,
  };
});

mockJest.mock('expo-modules-core', () => {
  const ReactNative = mockJest.requireActual('react-native');
  const actual = mockJest.requireActual('expo-modules-core');

  return {
    ...actual,
    requireNativeComponent: mockJest.fn((name) => name),
    requireOptionalNativeComponent: mockJest.fn((name) => name),
    Platform: ReactNative.Platform,
    View: ReactNative.View,
  };
});

mockJest.mock('expo-constants', () => {
  const constants = {
    expoConfig: {
      name: 'Veakay',
      slug: 'veakay',
      scheme: 'veakay',
    },
    installationTime: 0,
    isHeadless: false,
    linking: {
      uri: 'veakay://',
      urls: [],
    },
    manifest: {},
    manifest2: {},
    nativeAppVersion: '1.0.0',
    nativeBuildVersion: '1',
    osName: 'iOS',
    platform: {
      ios: {},
      android: {},
    },
    systemVersion: '1.0',
    userAgent: 'Veakay Jest',
    webExecutionEnvironment: 'jest',
  };

  return {
    __esModule: true,
    default: constants,
    Constants: constants,
  };
});

mockJest.mock('react-native-safe-area-context', () => {
  const View = mockJest.requireActual('react-native').View;
  const insets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  return {
    SafeAreaView: View,
    useSafeAreaFrame: () => ({
      x: 0,
      y: 0,
      width: 390,
      height: 844,
    }),
    useSafeAreaInsets: () => insets,
  };
});

mockJest.mock('expo-linear-gradient', () => ({
  LinearGradient: mockJest.requireActual('react-native').View,
}));

const ReactNative = mockJest.requireActual('react-native');

if (ReactNative.Alert && typeof ReactNative.Alert.alert === 'function') {
  ReactNative.Alert.alert = mockJest.fn();
}

if (ReactNative.ToastAndroid && typeof ReactNative.ToastAndroid.show === 'function') {
  ReactNative.ToastAndroid.show = mockJest.fn();
}

mockJest.mock('react-native-purchases', () => {
  const mockCustomerInfo = {
    entitlements: {
      active: {},
      all: {},
    },
    activeSubscriptions: [],
    allPurchasedProductIdentifiers: [],
    latestExpirationDate: null,
    originalAppUserId: 'test-user-id',
    managementURL: null,
    requestDate: '2024-01-01T00:00:00Z',
  };

  const mockOfferings = {
    all: {},
    current: {
      identifier: 'default',
      serverDescription: 'Agency Subscription',
      metadata: {},
      availablePackages: [],
      lifetime: null,
      annual: null,
      sixMonth: null,
      threeMonth: null,
      twoMonth: null,
      monthly: null,
      weekly: null,
      webCheckoutUrl: null,
    },
  };

  const mockPackage = {
    identifier: 'basic',
    packageType: 'CUSTOM',
    product: {
      identifier: 'com.veakay.agency.basic',
      title: 'Basic',
      description: 'Core package listing and booking requests.',
      price: 0,
      priceString: 'Free',
      currencyCode: 'USD',
      pricePerWeek: null,
      pricePerMonth: null,
      pricePerYear: null,
      pricePerWeekString: null,
      pricePerMonthString: null,
      pricePerYearString: null,
      introPrice: null,
      discounts: null,
      productCategory: null,
      productType: 'SUBSCRIPTION',
      subscriptionPeriod: 'P1M',
      defaultOption: null,
      subscriptionOptions: null,
      presentedOfferingIdentifier: null,
      presentedOfferingContext: null,
    },
    offeringIdentifier: 'default',
    presentedOfferingContext: {
      offeringIdentifier: 'default',
      placementIdentifier: null,
      targetingContext: null,
    },
    webCheckoutUrl: null,
  };

  const mockOfferingsWithPackages = {
    ...mockOfferings,
    current: {
      ...mockOfferings.current,
      availablePackages: [mockPackage],
    },
  };

  return {
    __esModule: true,
    default: {
      configure: mockJest.fn(),
      getOfferings: mockJest.fn(() => Promise.resolve(mockOfferingsWithPackages)),
      getCustomerInfo: mockJest.fn(() => Promise.resolve(mockCustomerInfo)),
      purchasePackage: mockJest.fn(() =>
        Promise.resolve({
          productIdentifier: 'com.veakay.agency.basic',
          customerInfo: mockCustomerInfo,
          transaction: { transactionIdentifier: 'txn_123' },
        }),
      ),
      restorePurchases: mockJest.fn(() => Promise.resolve(mockCustomerInfo)),
      logIn: mockJest.fn(() => Promise.resolve({ customerInfo: mockCustomerInfo, created: false })),
      logOut: mockJest.fn(() => Promise.resolve(mockCustomerInfo)),
      addCustomerInfoUpdateListener: mockJest.fn(),
      removeCustomerInfoUpdateListener: mockJest.fn(),
      setAllowSharingStoreAccount: mockJest.fn(() => Promise.resolve()),
      setDebugLogsEnabled: mockJest.fn(() => Promise.resolve()),
      setLogLevel: mockJest.fn(() => Promise.resolve()),
      invalidateCustomerInfoCache: mockJest.fn(() => Promise.resolve()),
      PURCHASES_ERROR_CODE: {
        UNKNOWN_ERROR: '0',
        PURCHASE_CANCELLED_ERROR: '1',
        STORE_PROBLEM_ERROR: '2',
        PURCHASE_NOT_ALLOWED_ERROR: '3',
        PURCHASE_INVALID_ERROR: '4',
        PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR: '5',
        PRODUCT_ALREADY_PURCHASED_ERROR: '6',
        NETWORK_ERROR: '10',
        INVALID_CREDENTIALS_ERROR: '11',
        UNSUPPORTED_ERROR: '24',
      },
      PRODUCT_CATEGORY: {
        NON_SUBSCRIPTION: 'NON_SUBSCRIPTION',
        SUBSCRIPTION: 'SUBSCRIPTION',
        UNKNOWN: 'UNKNOWN',
      },
      PACKAGE_TYPE: {
        UNKNOWN: 'UNKNOWN',
        CUSTOM: 'CUSTOM',
        LIFETIME: 'LIFETIME',
        ANNUAL: 'ANNUAL',
        SIX_MONTH: 'SIX_MONTH',
        THREE_MONTH: 'THREE_MONTH',
        TWO_MONTH: 'TWO_MONTH',
        MONTHLY: 'MONTHLY',
        WEEKLY: 'WEEKLY',
      },
    },
    PURCHASES_ERROR_CODE: {
      UNKNOWN_ERROR: '0',
      PURCHASE_CANCELLED_ERROR: '1',
      STORE_PROBLEM_ERROR: '2',
      PURCHASE_NOT_ALLOWED_ERROR: '3',
      PURCHASE_INVALID_ERROR: '4',
      PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR: '5',
      PRODUCT_ALREADY_PURCHASED_ERROR: '6',
      NETWORK_ERROR: '10',
      INVALID_CREDENTIALS_ERROR: '11',
      UNSUPPORTED_ERROR: '24',
    },
    PRODUCT_CATEGORY: {
      NON_SUBSCRIPTION: 'NON_SUBSCRIPTION',
      SUBSCRIPTION: 'SUBSCRIPTION',
      UNKNOWN: 'UNKNOWN',
    },
    PACKAGE_TYPE: {
      UNKNOWN: 'UNKNOWN',
      CUSTOM: 'CUSTOM',
      LIFETIME: 'LIFETIME',
      ANNUAL: 'ANNUAL',
      SIX_MONTH: 'SIX_MONTH',
      THREE_MONTH: 'THREE_MONTH',
      TWO_MONTH: 'TWO_MONTH',
      MONTHLY: 'MONTHLY',
      WEEKLY: 'WEEKLY',
    },
  };
});
