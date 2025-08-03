import * as cheerio from 'cheerio';
import { DictionaryEntry } from '../interfaces.js';
import { cleanText } from '../utils.js';

export const extractPOSLabels = ($: cheerio.CheerioAPI, entry: DictionaryEntry): void => {
  // 提取所有词性标识
  const $labelEl = $('.pos-g .pos, .pos-g .Ref>a');
  if ($labelEl.length === 0) {
    console.error(`单词 ${entry.word} 没有词性标识`);
  }
  $labelEl.each((_, el) => {
    const pos = cleanText($(el).text());
    if (pos) entry.parts_of_speech.push(pos);
  });
};
