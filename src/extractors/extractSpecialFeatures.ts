import { AnyNode } from 'domhandler';
import { PartOfSpeech } from '../interfaces.js';
import { cleanText } from '../utils.js';
import * as cheerio from 'cheerio';

/**
 * 提取限定词特殊结构特征
 */
export const extractDeterminerFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {


};

/**
 * 提取代词特殊结构特征
 */
export const extractPronounFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {

};

/**
 * 提取连词特殊结构特征
 */
export const extractConjunctionFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {
};

/**
 * 提取情态动词特殊结构特征
 */
export const extractModalFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {

};


/**
 * 提取动词特殊结构特征
 */
export const extractVerbFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {
  // 短语动词  PHRASAL VERBS
  // 包括近义词、反义词
};

/**
 * 提取名词特殊结构特征
 */
export const extractNounFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {
};

/**
 * 提取形容词特殊结构特征
 */
export const extractAdjectiveFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {
  // 提取比较级和最高级
  const comparatives: string[] = [];
  posSection.find('.f-g .f:contains(comparative), .f-g .f:contains(superlative)').each((_, formEl) => {
    const form = cleanText($(formEl).text());
    if (form) comparatives.push(form);
  });

  // 提取反义词
  const antonyms: string[] = [];
  posSection.find('.ant').each((_, antonymEl) => {
    const antonym = cleanText($(antonymEl).text());
    if (antonym) antonyms.push(antonym);
  });

  // 提取介词搭配
  const prepositionCollocations: string[] = [];
  posSection.find('.cf:contains(prep.)').each((_, collocationEl) => {
    const collocation = cleanText($(collocationEl).text());
    if (collocation) prepositionCollocations.push(collocation);
  });

  // 将提取的特征添加到每个义项
  posContent.senses.forEach(sense => {
    // 添加比较级和最高级
    if (comparatives.length > 0) {
      sense.spoken_form = comparatives.join('; ');
    }
    // 添加反义词
  
    // 添加介词搭配
    if (prepositionCollocations.length > 0 && !sense.grammar) {
      sense.grammar = prepositionCollocations.join('; ');
    }
  });
};

/**
 * 提取副词特殊结构特征
 */
export const extractAdverbFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {
  // 提取比较级和最高级
  const comparatives: string[] = [];
  posSection.find('.f-g .f:contains(comparative), .f-g .f:contains(superlative)').each((_, formEl) => {
    const form = cleanText($(formEl).text());
    if (form) comparatives.push(form);
  });

  // 提取位置说明
  const positionInfo = cleanText(posSection.find('.gram:contains(position)').text());

  // 将提取的特征添加到每个义项
  posContent.senses.forEach(sense => {
    // 添加比较级和最高级
    if (comparatives.length > 0) {
      sense.spoken_form = comparatives.join('; ');
    }
    // 添加位置说明
    if (positionInfo && !sense.grammar) {
      sense.grammar = positionInfo;
    }
  });
};

/**
 * 提取介词特殊结构特征
 */
export const extractPrepositionFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, posContent: PartOfSpeech): void => {

};

/**
 * 根据词性提取特殊结构特征的调度函数
 */
export const extractPOSSpecialFeatures = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>, pos: string, posContent: PartOfSpeech): void => {

  switch (pos.toLowerCase()) {
    case 'verb':
      extractVerbFeatures($, posSection, posContent);
      break;
    case 'noun':
      extractNounFeatures($, posSection, posContent);
      break;
    case 'adjective':
      extractAdjectiveFeatures($, posSection, posContent);
      break;
    case 'adverb':
      extractAdverbFeatures($, posSection, posContent);
      break;
    case 'preposition':
      extractPrepositionFeatures($, posSection, posContent);
      break;
    case 'determiner':
      extractDeterminerFeatures($, posSection, posContent);
      break;
    case 'pronoun':
      extractPronounFeatures($, posSection, posContent);
      break;
    case 'conjunction':
      extractConjunctionFeatures($, posSection, posContent);
      break;
    case 'modal':
      extractModalFeatures($, posSection, posContent);
      break;
    default:
      break;
  }
};