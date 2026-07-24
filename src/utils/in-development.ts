import { Alert } from 'react-native';

export function showInDevelopmentAlert(
  detail?: string,
  title = 'Not available yet',
  onDismiss?: () => void,
) {
  Alert.alert(
    title,
    detail
      ? `This is not functional at the moment — still in development. ${detail}`
      : 'This is not functional at the moment — still in development.',
    onDismiss ? [{ text: 'OK', onPress: onDismiss }] : undefined,
  );
}
