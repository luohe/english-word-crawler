import { DictionaryEntry } from '../interfaces.js';
import * as cheerio from 'cheerio';

/**
 * 从HTML中提取单词的变形信息
 * @param html 包含单词信息的HTML字符串
 * @param entry 正在构建的词典条目对象
 * @returns 更新后的词典条目对象
 */
export function extractWordForms(html: string, entry: DictionaryEntry): DictionaryEntry {
  const $ = cheerio.load(html);
  const wordForms: string[] = [];

  // 查找所有包含变形信息的容器
  $('.infl').each((_, element) => {
    const $element = $(element);

    // 提取所有变形形式
    $element.find('.inflection').each((_, inflectionEl) => {
      const form = $(inflectionEl).text().trim();
      if (form) {
        wordForms.push(form);
      }
    });
  });

  // 将提取的变形信息添加到词典条目中
  if (wordForms.length > 0) {
    entry.word_forms = wordForms;
  }

  return entry;
}