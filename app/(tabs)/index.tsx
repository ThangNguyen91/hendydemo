import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { VoiceAssistant } from '@/components/VoiceAssistant';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <VoiceAssistant />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2B42', // Màu nền xanh đậm tương tự Hendy
  },
});
