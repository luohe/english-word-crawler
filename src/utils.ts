import * as cheerio from 'cheerio';
import { AnyNode } from 'domhandler';
import { posAbbreviationMap } from './constants.js';

// 文本清洗工具函数
export const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')    
    .replace(/^\s+|\s+$/g, '')    
    .replace(/\[\s*/g, '[')    
    .replace(/\s*\]/g, ']')    
    .replace(/\(\s*/g, '(')    
    .replace(/\s*\)/g, ')');
};

// 获取词性缩写
/**
 * 获取词性缩写
 * @param pos 词性英文名称
 * @returns 词性缩写
 */
export const getPosAbbreviation = (pos: string): string => {
  return posAbbreviationMap[pos.toLowerCase()] || pos.toLowerCase();
};

const CHINESE_SEL = '.chn';
/**
 * 解析 dom 节点，返回英文和中文字段
 * @param $el cheerio 节点
 * @param chnSelector 中文内容选择器
 */
export function parseTextAndChn(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<AnyNode>,
): { text?: string; chn?: string } {
  if ($el.length === 0) return;

  const text = cleanText($el.contents().not(CHINESE_SEL).get().map(el => $(el).text().trim()).join(' '));
  const chn = cleanText($el.find(CHINESE_SEL).text().trim());

  if (text === undefined || chn === undefined) console.log("有结构但是没有定义")
  return { text, chn };
}