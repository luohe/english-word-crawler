import { AnyNode } from 'domhandler';
import * as cheerio from 'cheerio';
import { PhrasalVerb, Sense } from '../interfaces.js';
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
 * 提取短语信息
 * @param $ 
 * @param posSection 
 * @returns 
 */
export const extractPhrasalVerbs = ($: cheerio.CheerioAPI, posSection: cheerio.Cheerio<AnyNode>): PhrasalVerb[] => {
  const phrasalVerbs: PhrasalVerb[] = [];

  posSection.find(`>.pvs-g >.pv-g`).each((_, phrasalEl) => {
    const $phrasalEl = $(phrasalEl);
    const phrasalVerb: PhrasalVerb = {
      basePhrase: cleanText($phrasalEl.find('.pv').text()) || '',
      usageNote: parseTextAndChn($, $phrasalEl.find(".def-g > .d")),
      senses: extractSense($, $phrasalEl.find(IDIOM_SELECTORS.sense)),
    };

    phrasalVerbs.push(phrasalVerb);
  });

  return phrasalVerbs;
};