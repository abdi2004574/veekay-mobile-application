import { useLocalSearchParams } from 'expo-router';
import { ChatThreadScreen } from '../../../src/components/ChatThreadScreen';

export default function AgencyChatThreadRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatThreadScreen conversationId={id} />;
}
