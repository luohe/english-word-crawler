import * as cheerio from 'cheerio';
import { DictionaryEntry, Synonyms, SynonymDetail, Example } from '../interfaces.js';
import { cleanText } from '../utils.js';

export const extractSynonyms = ($: cheerio.CheerioAPI, entry: DictionaryEntry): void => {
  // 提取同义词信息
  const synonymSection = $('.unbox').first();
  if (!synonymSection.length) return;

  const synonyms: Synonyms = {
    title: cleanText(synonymSection.find('.title').text()) || '',
    synonyms_list: synonymSection.find('.subhead').text()
      .split('◆')
      .map(s => cleanText(s))
      .filter(Boolean),
    explanation: cleanText(synonymSection.find('.para').first().text()) || '',
    details: [],
    patterns: []
  };

  // 提取同义词详细信息
  synonymSection.find('.para:has(.unsyn)').each((_, detailEl) => {
    const detail: SynonymDetail = {
      word: cleanText($(detailEl).find('.unsyn').text()) || '',
      label: cleanText($(detailEl).find('.unei').text()) || undefined,
      definition: cleanText($(detailEl).find('.und').first().contents().not('.chn').text()) || '',
      definition_chn: cleanText($(detailEl).find('.chn').first().text()) || '',
      examples: [],
      note: cleanText($(detailEl).find('.symbols-notesym').closest('.und').text()) || undefined
    };

    // 提取同义词例句
    $(detailEl).find('.x-g').each((_, xEl) => {
      const english = cleanText($(xEl).find('.x').text());
      const chinese = cleanText($(xEl).find('.tx').text());
      if (english) detail.examples.push({ english, chinese });
    });

    if (detail.examples.length === 1) {
      detail.example = detail.examples[0];
    }

    synonyms.details.push(detail);
  });

  // 提取patterns
  synonymSection.find('.patterns .para').each((_, pEl) => {
    const pattern = cleanText($(pEl).text().replace('◆', '')) || '';
    if (pattern) synonyms.patterns.push(pattern);
  });

  entry.synonyms = synonyms;
};
