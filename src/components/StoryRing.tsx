import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from './Avatar';
import { colors, vaykaeGradient } from '../constants/colors';

interface StoryRingProps {
  name: string;
  onPress: () => void;
}

export function StoryRing({ name, onPress }: StoryRingProps) {
  return (
    <Pressable onPress={onPress} className="items-center" style={{ width: 72 }}>
      <LinearGradient
        colors={vaykaeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar name={name} size={52} />
        </View>
      </LinearGradient>
      <Text numberOfLines={1} className="text-xs font-medium mt-1.5 text-foreground">
        {name}
      </Text>
    </Pressable>
  );
}
