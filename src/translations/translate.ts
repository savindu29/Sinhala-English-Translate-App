// src/translations/translate.ts
import axios from 'axios';

const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  try {
    const response = await axios.get(
      'https://api.mymemory.translated.net/get',
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      }
    );
    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return 'Translation error';
  }
};

export default translateText;
