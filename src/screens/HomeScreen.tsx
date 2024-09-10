import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Clipboard, Alert, Text } from 'react-native';
import { TextInput, Button, Card, Title, Provider as PaperProvider, Appbar, Avatar, Snackbar, IconButton } from 'react-native-paper';
import * as Speech from 'expo-speech';
import translateText from '../translations/translate';
import textMeaning from '../translations/textMeaning';

const HomeScreen = () => {
  const [text, setText] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [meaning, setMeaning] = useState<string>('');
  const [meaning2, setMeaning2] = useState<string>('');
  const [isSinhalaToEnglish, setIsSinhalaToEnglish] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleTranslate = async () => {
    if (text.trim() === '') {
      setError('Please enter a word or phrase to translate.');
      setShowResult(false);
      return;
    }
    if (text.trim().split(/\s+/).length > 2) {
      setError('Please enter no more than two words.');
      setShowResult(false);
      return;
    }
    try {
      const sourceLang = isSinhalaToEnglish ? 'si' : 'en';
      const targetLang = isSinhalaToEnglish ? 'en' : 'si';
      const translatedText = await translateText(text, sourceLang, targetLang);
      setTranslation(translatedText);
      setShowResult(true);
      setError('');
    if(isSinhalaToEnglish){
      const generatedMeaning = await textMeaning(translatedText, targetLang, sourceLang); // Swapping languages for meaning
      console.log(generatedMeaning);
      
      setMeaning(generatedMeaning);
    } else {
        const generatedMeaning = await textMeaning(text,sourceLang, targetLang);
     
        
        const translatedText = await translateText(generatedMeaning, sourceLang, targetLang);
     
        
        setMeaning2(translatedText);
    }
      
    } catch (err: any) {
      setError('Error translating text: ' + err.message);
      setShowResult(false);
    }
  };

  const toggleLanguage = () => {
    setIsSinhalaToEnglish(!isSinhalaToEnglish);
    setText('');
    setTranslation('');
    setMeaning('');
    setMeaning2('');
    setShowResult(false);
  };

  const handleCopy = () => {
    Clipboard.setString(translation);
    Alert.alert('Copied to clipboard');
  };

  const handleSpeak = (text: string) => {
    Speech.speak(text);
  };

  const handleTextChange = (input: string) => {
    if (input.trim().split(/\s+/).length > 2) {
      setError('Please enter no more than two words.');
      return;
    }

    setError('');  // Clear error if valid input

    if (isSinhalaToEnglish) {
      // Allow only Sinhala letters
      const sinhalaRegex = /^[\u0D80-\u0DFF\s]*$/;
      if (sinhalaRegex.test(input)) {
        setText(input);
      }
    } else {
      // Allow only English letters
      const englishRegex = /^[A-Za-z\s]*$/;
      if (englishRegex.test(input)) {
        setText(input);
      }
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="සිංහල - English Dictionary" style={styles.headerTitle} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.languageRow}>
          <View style={styles.languageContainer}>
            <Title style={styles.languageText}>{isSinhalaToEnglish ? 'සිංහල' : 'English'}</Title>
          </View>
          <TouchableOpacity onPress={toggleLanguage} style={styles.swapIconContainer}>
            <Avatar.Icon size={36} icon="swap-horizontal" />
          </TouchableOpacity>
          <View style={styles.languageContainer}>
            <Title style={styles.languageText}>{isSinhalaToEnglish ? 'English' : 'සිංහල'}</Title>
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={40}
              source={isSinhalaToEnglish ? require('../../assets/sri_lanka_flag.png') : require('../../assets/uk_flag.png')}
            />
          </View>
          <TextInput
            label={isSinhalaToEnglish ? 'සිංහල පද' : 'English Word'}
            value={text}
            onChangeText={handleTextChange}
            style={styles.input}
            mode="outlined"
            outlineColor="#6200ee"
            activeOutlineColor="#6200ee"
            theme={{ roundness: 10 }}
            error={!!error}
          />
        </View>
        <Button mode="contained" onPress={handleTranslate} style={styles.button}>
          Translate
        </Button>
        {showResult && (
          <>
            <Card style={styles.translationCard}>
              <Card.Content style={styles.translationContent}>
                <Avatar.Image
                  size={24}
                  source={isSinhalaToEnglish ? require('../../assets/uk_flag.png') : require('../../assets/sri_lanka_flag.png')}
                  style={styles.translationFlag}
                />
                <Title style={styles.translationText}>{translation}</Title>
                <IconButton icon="content-copy" onPress={handleCopy} />
                <IconButton icon="volume-high" onPress={() => handleSpeak(translation)} />
              </Card.Content>
            </Card>
            <Card style={styles.meaningCard}>
              <Card.Content>
                <Title>{isSinhalaToEnglish ? 'Simple description' : 'සරල විස්තරය '}</Title>
                <View style={styles.meaningRow}>
                  <Text style={styles.meaningText}>{isSinhalaToEnglish ? `${meaning}` : `${meaning2}`}</Text>
                  <IconButton icon="volume-high" onPress={() => handleSpeak(meaning)} />
                </View>
              </Card.Content>
            </Card>
          </>
        )}
        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    paddingTop: 40,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  languageContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  swapIconContainer: {
    paddingHorizontal: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  translationCard: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  translationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  translationFlag: {
    marginRight: 10,
  },
  translationText: {
    flex: 1,
    fontSize: 18,
  },
  meaningCard: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  meaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meaningText: {
    flex: 1,
    fontSize: 18,
  },
  snackbar: {
    backgroundColor: '#ff5252',
  },
});

export default HomeScreen;
