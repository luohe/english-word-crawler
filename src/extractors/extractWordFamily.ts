import { AnyNode } from 'domhandler';
import * as cheerio from 'cheerio';
import { WordFamilyItem } from "../interfaces.js";
import { cleanText } from '../utils.js';

// 提取单词家族
export const extractWordFamily = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>): WordFamilyItem[] => {
  const wordFamilyItems: WordFamilyItem[] = [];

  // 查找所有词族容器
  posSection.find('.wordbox[type="word_family"] .wf-g').each((_, wordFamilyGroup) => {
    const $wordFamilyGroup = $(wordFamilyGroup);
    const word = cleanText($wordFamilyGroup.find('.wfw').text());
    const posText = cleanText($wordFamilyGroup.find('>.pos-g>.pos').text());

    if (word && posText) {
      wordFamilyItems.push({
        word,
        pos: posText
      });
    }
  });

  return wordFamilyItems;
};