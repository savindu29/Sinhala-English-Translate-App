import axios from 'axios';

const textMeaning = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  if (sourceLang === 'en') {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.length > 0) {
        const meaning = response.data[0].meanings[0].definitions[0].definition;
        return meaning;
      } else {
        return ('Meaning not found');
      }
    } catch (error) {
      return ('Meaning not found');
    }
  } else {
    // For Sinhala, you might need to use another service or API
    return ('Meaning not found');
  }
};

export default textMeaning;
