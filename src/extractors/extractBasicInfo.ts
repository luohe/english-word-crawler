import * as cheerio from 'cheerio';
import { DictionaryEntry } from '../interfaces.js';
import { cleanText } from '../utils.js';

export const extractBasicInfo = ($: cheerio.CheerioAPI, entry: DictionaryEntry): void => {
  // 提取基本信息（单词、星级）
  entry.word = cleanText($('.h-g .top-g .h').first().text()) || '';
  entry.star = cleanText($('.symbols-coresym').first().text()) || undefined;

  // 提取条目编号（如well_2中的'2'）
  const entryElement = $('.entry').first();
  const eid = entryElement.attr('eid') || '';
  const id = entryElement.attr('id') || '';

  // 尝试从eid或id属性中提取数字
  const match = eid.match(/_(\d+)_/) || id.match(/_(\d+)_/);
  if (match && match[1]) {
    entry.entry_number = match[1];
  }
};
