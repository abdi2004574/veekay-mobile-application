import { useLocalSearchParams } from 'expo-router';
import { ChatThreadScreen } from '../../../src/components/ChatThreadScreen';

export default function TravelerChatThreadRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatThreadScreen conversationId={id} />;
}
