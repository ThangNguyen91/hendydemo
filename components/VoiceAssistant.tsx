import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export const VoiceAssistant = () => {
  const {
    isListening,
    results,
    error,
    startListening,
    stopListening,
    speak,
  } = useVoiceRecognition();

  const [displayMessage, setDisplayMessage] = useState("How can I help you?");

  useEffect(() => {
    if (isListening) {
      setDisplayMessage("Listening...");
    } else if (results.length > 0) {
      const lastResult = results[results.length - 1];
      setDisplayMessage(lastResult);
      console.log('Recognition result:', lastResult);
      // Example: Respond with voice
      speak(`I heard: ${lastResult}`);
    } else {
      setDisplayMessage("How can I help you?");
    }
  }, [isListening, results, speak]);

  useEffect(() => {
    if (error) {
      setDisplayMessage(`Error: ${error}`);
    }
  }, [error]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>HENDY</ThemedText>

      <ThemedView style={styles.messageBox}>
        <ThemedText style={styles.messageText}>
          {displayMessage}
        </ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonActive]}
        onPress={isListening ? stopListening : startListening}
      >
        <MaterialIcons
          name={isListening ? 'mic' : 'mic-none'}
          size={32}
          color={isListening ? '#FF3B30' : '#007AFF'}
        />
      </TouchableOpacity>
      
      {/* Sound wave visualization placeholder */}
      <View style={styles.soundWavePlaceholder} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent', // Giữ nền trong suốt để màu nền chính từ index.tsx
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Màu nền mờ
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginBottom: 30,
    width: '90%', // Đảm bảo rộng vừa đủ
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white', // Nút micro màu trắng
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 30, // Khoảng cách từ hộp tin nhắn
  },
  buttonActive: {
    backgroundColor: '#FFE5E5',
  },
  soundWavePlaceholder: {
    width: '100%',
    height: 80, // Chiều cao cho hiệu ứng sóng âm
    // backgroundColor: 'blue', // Để dễ hình dung
    marginTop: 40,
  },
}); 