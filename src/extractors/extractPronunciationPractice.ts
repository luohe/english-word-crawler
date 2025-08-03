import * as cheerio from 'cheerio';
import { DictionaryEntry, PronunciationPracticeWord } from '../interfaces.js';
import { cleanText } from '../utils.js';

export const extractPronunciationPractice = ($: cheerio.CheerioAPI, entry: DictionaryEntry): void => {
  // 提取发音练习
  const pracpronSection = $('.pracpron');
  if (!pracpronSection.length) return;

  pracpronSection.find('.pron-g').each((_, pronEl) => {
    const word = cleanText($(pronEl).find('.wd').text()) || '';
    if (!word) return;

    const practiceWord: PronunciationPracticeWord = {
      word,
      pronunciation: {
        uk: cleanText($(pronEl).find('.phon-gb').text()) ? `/${cleanText($(pronEl).find('.phon-gb').text())}/` : undefined,
        uk_audio_url: $(pronEl).find('a[resource="uk_pron"]').attr('href') || undefined,
        us: cleanText($(pronEl).find('.phon-us').text()) ? `/${cleanText($(pronEl).find('.phon-us').text())}/` : undefined,
        us_audio_url: $(pronEl).find('a[resource="us_pron"]').attr('href') || undefined
      }
    };

    entry.pronunciation_practice.words.push(practiceWord);
  });
};
