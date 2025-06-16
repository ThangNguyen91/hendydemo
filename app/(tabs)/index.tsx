import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { VoiceAssistant } from '@/components/VoiceAssistant';

const HomeScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <VoiceAssistant />
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
