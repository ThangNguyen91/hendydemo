import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import Voice from '@react-native-voice/voice';
import { PermissionsAndroid, Platform } from 'react-native';

const HENDY_LOGO = () => (
  <Text style={styles.logo}>HENDY</Text>
);

const AudioSpectrum = () => (
  <Image source={require('./assets/images/Audio_Spectrum.gif')} style={styles.spectrum} resizeMode="contain" />
);

export default function App() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('How can I help you?');

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const onSpeechStart = () => {
      setListening(true);
      setError(null);
    };

    const onSpeechEnd = () => {
      setListening(false);
    };

    const onSpeechError = (e: any) => {
      setError(`Error: ${e.error?.message || 'Could not start voice recognition'}`);
      setListening(false);
    };

    const onSpeechResults = (e: any) => {
      const result = e.value?.[0];
      if (result) setMessage(result);
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onMicPress = async () => {
    if (listening) {
      await Voice.stop();
      setListening(false);
    } else {
      setError(null);
      setMessage('How can I help you?');
      try {
        const micGranted = await requestMicrophonePermission();
        if (!micGranted) {
          setError('Microphone permission denied');
          return;
        }

        await Voice.start('en-US');
      } catch (e) {
        setError('Error: Could not start voice recognition');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <HENDY_LOGO />
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{error ? error : message}</Text>
        </View>
        {listening && <AudioSpectrum />}
        <TouchableOpacity style={styles.micButton} onPress={onMicPress} activeOpacity={0.7}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/microphone.png' }} style={styles.micIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/home.png' }} style={styles.tabIcon} />
          <Text style={styles.tabLabel}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/compass.png' }} style={styles.tabIcon} />
          <Text style={styles.tabLabel}>Explore</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18305A',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 4,
    marginTop: 40,
    marginBottom: 40,
    textAlign: 'center',
  },
  messageBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 16,
    marginBottom: 30,
    minWidth: 260,
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  spectrum: {
    width: 220,
    height: 60,
    marginBottom: 30,
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  micIcon: {
    width: 36,
    height: 36,
    tintColor: '#18305A',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#112040',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    width: 28,
    height: 28,
    marginBottom: 2,
    tintColor: 'white',
  },
  tabLabel: {
    color: 'white',
    fontSize: 13,
  },
});
