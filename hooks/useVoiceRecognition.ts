import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Khởi tạo Voice
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // Khởi tạo TTS
    const initializeTTS = async () => {
      try {
        // Wait for TTS to be ready
        await new Promise((resolve) => {
          Tts.addEventListener('tts-start', () => resolve(true));
          Tts.addEventListener('tts-finish', () => resolve(true));
          Tts.addEventListener('tts-cancel', () => resolve(true));
        });
        
        const status = await Tts.getInitStatus();
        if (!status) {
          throw new Error('TTS status is null');
        }
        
        if (status === 'success') {
          await Promise.all([
            Tts.setDefaultLanguage('en-US'),
            Tts.setDefaultRate(0.5),
            Tts.setDefaultPitch(1.0)
          ]);
          console.log('TTS initialized and language set successfully.');
        } else {
          console.error('TTS initialization failed with status:', status);
          setError('Failed to initialize text-to-speech or language not supported.');
        }
      } catch (e) {
        console.error("Error initializing TTS:", e);
        setError('Error initializing text-to-speech. Please check your device.');
      }
    };

    // Gọi hàm khởi tạo
    initializeTTS();

    // Thêm các trình nghe sự kiện TTS để gỡ lỗi
    Tts.addEventListener('tts-start', (event) => console.log('TTS Start', event));
    Tts.addEventListener('tts-finish', (event) => console.log('TTS Finish', event));
    Tts.addEventListener('tts-cancel', (event) => console.log('TTS Cancel', event));

    return () => {
      // Cleanup
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.stop();
      // Xóa tất cả các trình nghe TTS để tránh rò rỉ bộ nhớ
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value) {
      setResults(e.value);
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(e.error?.message || 'An error occurred during voice recognition');
  };

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setResults([]);
      let permissionResult;
      if (Platform.OS === 'android') {
        permissionResult = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (permissionResult !== RESULTS.GRANTED) {
          const requestResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          if (requestResult !== RESULTS.GRANTED) {
            setError('Microphone permission denied');
            return;
          }
        }
      } else if (Platform.OS === 'ios') {
        permissionResult = await check(PERMISSIONS.IOS.MICROPHONE);
        if (permissionResult !== RESULTS.GRANTED) {
          const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
          if (requestResult !== RESULTS.GRANTED) {
            setError('Microphone permission denied');
            return;
          }
        }
      }
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      setError('Could not start voice recognition');
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      setError('Could not stop voice recognition');
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      await Tts.speak(text);
    } catch (e) {
      setError('Could not play audio');
    }
  }, []);

  return {
    isListening,
    results,
    error,
    startListening,
    stopListening,
    speak,
  };
}; 