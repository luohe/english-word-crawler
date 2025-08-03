import { AnyNode } from 'domhandler';
import * as cheerio from 'cheerio';
import { Idiom, Sense } from '../interfaces.js';
import { cleanText, parseTextAndChn } from '../utils.js';
import { IDIOM_SELECTORS } from '../selectors/idiom.js';
import { extractDefG } from './extractPOSContent.js';

/**
 * 提取sense信息
 */
const extractSense = ($, $senseEl) => {
  const senses: Sense[] = [];
  $senseEl.find(IDIOM_SELECTORS.definition.container).map((_, defEl) => {
    senses.push(extractDefG($, $(defEl)));
  });
  return senses;
}

/**
 * 提取习语信息
 * @param $ 
 * @param posSection 
 * @returns 
 */
export const extractIdioms = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>): Idiom[] => {
  const idioms: Idiom[] = [];

  posSection.find(`${IDIOM_SELECTORS.group} ${IDIOM_SELECTORS.idG}`).each((_, idiomEl) => {
    const $idiomEl = $(idiomEl);
    const idiom: Idiom = {
      basePhrase: cleanText($idiomEl.find(IDIOM_SELECTORS.id).text()) || '',
      usageNote: parseTextAndChn($, $idiomEl.find(IDIOM_SELECTORS.cm)),
      senses: extractSense($, $idiomEl.find(IDIOM_SELECTORS.sense)),
    };

    idioms.push(idiom);
  });

  return idioms;
};