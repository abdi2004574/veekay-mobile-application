import { Pressable, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../constants/colors';

const SIZES = { sm: 16, md: 22, lg: 32 } as const;

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: keyof typeof SIZES;
  readonly?: boolean;
}

export function StarRating({ rating, onRatingChange, size = 'md', readonly }: StarRatingProps) {
  const starSize = SIZES[size];
  const isInteractive = !readonly && !!onRatingChange;

  return (
    <View className="flex-row" style={{ gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) =>
        isInteractive ? (
          <Pressable key={star} onPress={() => onRatingChange(star)} hitSlop={4}>
            <Star
              size={starSize}
              color={star <= rating ? colors.starGold : colors.mutedForeground}
              fill={star <= rating ? colors.starGold : 'transparent'}
            />
          </Pressable>
        ) : (
          <Star
            key={star}
            size={starSize}
            color={star <= rating ? colors.starGold : colors.mutedForeground}
            fill={star <= rating ? colors.starGold : 'transparent'}
          />
        ),
      )}
    </View>
  );
}
