import { StyleSheet, Text } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

const HomeScreen = () => {
  const { error } = useVoiceRecognition();

  return (
    <ThemedView style={styles.container}>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, margin: 20 }}>{error}</Text>
      ) : (
        <VoiceAssistant />
      )}
    </ThemedView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2B42', // Màu nền xanh đậm tương tự Hendy
  },
});
