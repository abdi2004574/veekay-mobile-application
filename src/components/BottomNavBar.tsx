import { Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { colors, vaykaeGradient } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

// Content height only — screens with a floating action button must also add
// the device's own bottom safe-area inset (via useSafeAreaInsets) on top of
// this, since that inset varies per device and isn't part of this constant.
export const BOTTOM_NAV_HEIGHT = 64;

export interface BottomNavItem {
  key: string;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

interface BottomNavBarProps {
  items: BottomNavItem[];
  active: string;
}

// Matches figma-demo's Root.tsx / AgencyRoot.tsx fixed bottom nav — hidden on
// detail/sub screens (each screen decides whether to render this at all),
// active tab shown as a gradient pill, matching the web reference exactly.
export function BottomNavBar({ items, active }: BottomNavBarProps) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <SafeAreaView edges={['bottom']}>
        <View className="flex-row items-center justify-around" style={{ height: 64 }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            const content = (
              <View className="items-center justify-center gap-1 px-4 py-2">
                <Icon size={20} color={isActive ? colors.background : colors.mutedForeground} />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    color: isActive ? colors.background : colors.mutedForeground,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            );
            return (
              <Pressable
                key={item.key}
                // Tapping the already-active tab must be a true no-op — even
                // router.replace() to the same route remounts the screen and
                // replays its entrance animation.
                onPress={isActive ? undefined : item.onPress}
                hitSlop={4}
              >
                {isActive ? (
                  <LinearGradient
                    colors={vaykaeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 16 }}
                  >
                    {content}
                  </LinearGradient>
                ) : (
                  content
                )}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}
