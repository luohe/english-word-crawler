import * as cheerio from 'cheerio';
import { DictionaryEntry } from '../interfaces.js';
import { cleanText } from '../utils.js';

export const extractPronunciation = ($: cheerio.CheerioAPI, entry: DictionaryEntry): void => {
  // 提取发音信息（英式/美式）
  entry.pronunciation.uk.phonetic = cleanText($('.phon-gb').first().text()) || undefined;
  entry.pronunciation.uk.audio_url = $('.phon-gb').closest('.ei-g').find('a[resource="uk_pron"]').attr('href') || undefined;
  entry.pronunciation.us.phonetic = cleanText($('.phon-us').first().text()) || undefined;
  entry.pronunciation.us.audio_url = $('.phon-us').closest('.ei-g').find('a[resource="us_pron"]').attr('href') || undefined;
};
