import { Component, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('UI error caught by boundary:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text className="text-xl font-bold text-foreground mb-2 text-center">
            Something went wrong
          </Text>
          <Text className="text-sm text-center mb-6" style={{ color: colors.mutedForeground }}>
            An unexpected error occurred. Please try again or restart the app.
          </Text>
          <Pressable
            onPress={this.handleRetry}
            className="px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.vaykaePink }}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
