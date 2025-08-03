import { AnyNode } from 'domhandler';
import { cloneDeep } from 'lodash-es';
import * as cheerio from 'cheerio';
import { DictionaryEntry, PartOfSpeech, Sense, Collocation } from '../interfaces.js';
import { cleanText, getPosAbbreviation, parseTextAndChn } from '../utils.js';
import { extractPOSSpecialFeatures } from './extractSpecialFeatures.js';
import { extractIdioms } from './extractIdioms.js';
import { POS_SELECTORS } from '../selectors/partOfSpeech.js';
import { extractPhrasalVerbs } from './extractPhrasalVerbs.js';
import { extractWordFamily } from './extractWordFamily.js';

// 提取近义词、反义词
export const extractAntonymsAndSynonyms = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>) => {
  // symbols-oppsym
  const antonyms: string[] = [];
  // symbols-synsym
  const synonyms: string[] = [];
  // TODO
  return { antonyms, synonyms };
}

/**
 * 初始化词性内容对象
 */
const initPartOfSpeech = (): PartOfSpeech => ({
  senses: [],
  idioms: [],
  phrasalVerbs: [],
});

const DEFAULT_COLLOCATION: Collocation = { pattern: undefined, examples: [] };
/**
 * 提取搭配模式及其例句
 * 包括有pattern的搭配例句和没有pattern的普通例句
 */
const extractCollocationsWithExamples = ($: cheerio.CheerioAPI, $defEl: cheerio.Cheerio<AnyNode>): Collocation[] => {
  const collocations: Collocation[] = [];
  const cfAndExampleElements = $defEl.siblings(`${POS_SELECTORS.collocation.pattern}, ${POS_SELECTORS.example.group}`);
  if (cfAndExampleElements.length === 0) return collocations;
 
  let collocation: Collocation = cloneDeep(DEFAULT_COLLOCATION);
  let $nextEle = cfAndExampleElements.first()
  while($nextEle.length > 0) {
    if ($nextEle.hasClass(POS_SELECTORS.collocation.pattern.replace('.', ''))) {
      if (collocation.examples.length > 0) collocations.push(collocation);
      collocation = cloneDeep(DEFAULT_COLLOCATION);
      collocation.pattern = $nextEle.contents().get().map(el => $(el).text().trim()).join(' ');
    }

    // 处理例句
    if ($nextEle.hasClass(POS_SELECTORS.example.group.replace('.', ''))) {
      const english = cleanText($nextEle.find(POS_SELECTORS.example.english).text());
      const chinese = cleanText($nextEle.find(POS_SELECTORS.example.chinese).text());
      if (english || chinese) {
        collocation.examples.push({ english, chinese: chinese || '' });
      }
    }

    $nextEle = $nextEle.next();
  }
  if (collocation.examples.length > 0) collocations.push(collocation);

  return collocations.length > 0 ? collocations : undefined;
};

// 解析def-g结构信息
export const extractDefG = ($, $defEl): Sense => {
  return {
    definition: parseTextAndChn($, $defEl.find(POS_SELECTORS.definition.text)),
    collocations: extractCollocationsWithExamples($, $defEl),
  }
}

/**
 * 提取义项信息
 */
export const extractSenses = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>): Sense[] => {
  const senses: Sense[] = [];
  // 尝试使用.n-g选择器查找义项
  let nGSenseEls = posSection.find(POS_SELECTORS.ngStructure.container);
  // 如果没有词性标识，则可能在 h-g下
  if (nGSenseEls.length === 0) nGSenseEls = $('.entry .h-g');

  // 处理n-g > def-g结构
  nGSenseEls.each((_, senseEl) => {
    const $senseEl = $(senseEl);
    // 词性分组编码
    const baseSenseNumber = cleanText($senseEl.find(POS_SELECTORS.ngStructure.senseNumber).text()) || '';
    // 语法特征
    const grammar = cleanText($senseEl.find(POS_SELECTORS.ngStructure.grammar).get().map(el => $(el).text().trim()).join(', ')) || undefined

    // 处理n-g下的每个def-g
    $senseEl.find(POS_SELECTORS.defStructure.container).each((defIndex, defEl) => {
      const $defEl = $(defEl);
      const senseNumber = defIndex === 0 ? baseSenseNumber : `${baseSenseNumber}.${defIndex + 1}`;

      // 查找当前n-g元素所属的义项分组（向上查找）
      const $sdgEl = $senseEl.parent(POS_SELECTORS.sdgStructure.container);

      const defSense = extractDefG($, $defEl);
      const sense: Sense = {
        ...defSense,
        sense_number: senseNumber,
        star: cleanText($senseEl.find(POS_SELECTORS.ngStructure.smallStar).text()),
        grammar: grammar,
        sdg: parseTextAndChn($, $sdgEl.find(POS_SELECTORS.sdgStructure.text))
      };
       if (defIndex !== 0) console.error(`单词 ${defSense.definition} ng下出现了两个def-g，当前索引为${defIndex}`)

      senses.push(sense);
    });
  });

  return senses;
};

/**
 * 提取各类词性内容
 */
export const extractPOSContent = ($: cheerio.CheerioAPI, entry: DictionaryEntry): void => {
  entry.parts_of_speech.forEach(pos => {
    // 获取词性缩写
    const posAbbrev = getPosAbbreviation(pos);
    // 将词性转换为接口中的属性名格式（小写）
    const posKey = pos.toLowerCase() as keyof DictionaryEntry;
    // 构建锚点名称，支持带条目编号的情况
    const anchorName = entry.entry_number
      ? `${entry.word}_${entry.entry_number}_pos_${posAbbrev}`
      : `${entry.word}_pos_${posAbbrev}`;
    let posSection = $(POS_SELECTORS.posAnchorPattern.replace('{anchorName}', anchorName));

    // 初始化词性内容
    const posContent = initPartOfSpeech();

    // 提取义项
    posContent.senses = extractSenses($, posSection);

    // 短语
    posContent.phrasalVerbs = extractPhrasalVerbs($, posSection);

    // 词族信息
    posContent.word_family = extractWordFamily($, posSection);

    // 提取习语
    posContent.idioms = extractIdioms($, posSection);

    // 提取特殊结构特征
    extractPOSSpecialFeatures($, posSection, pos, posContent);

    // 使用类型断言确保类型安全
    (entry as any)[posKey] = posContent;
  });
};
