// 定义TypeScript接口（支持多种词性）
export interface Pronunciation {
  phonetic?: string;
  audio_url?: string;
}

export interface PronunciationDetail {
  uk: Pronunciation;
  us: Pronunciation;
}

export interface Example {
  english: string;
  chinese: string;
}

export interface Definition {
  text?: string;
  chn?: string;
}

export interface Collocation {
  pattern?: string;
  examples: Example[];
}

export interface Sense {
  // 定义
  definition: Definition;
  // 所有例句都放在collocations中
  collocations: Collocation[];
  sense_number?: string;
  star?: string;
  // 语法
  grammar?: string;
  // 义项分组
  sdg?: Definition;

  spoken_form?: string;
  spoken_explanation?: string;
  swung_dash?: string;
}

export interface Idiom {
  // 短语原句
  basePhrase: string,
  // 补充说明
  usageNote: Definition,
  // 义项信息和例句
  senses: Sense[],
}

// 词族信息
export interface WordFamilyItem {
  word: string;
  pos: string;
}

// 短语动词
export interface PhrasalVerb {
  // 短语原句
  basePhrase: string,
  // 补充说明
  usageNote: Definition,
  // 义项信息和例句
  senses: Sense[],
}


export interface PartOfSpeech {
  // 词性
  senses: Sense[];
  // 俚语
  idioms: Idiom[];
  // 短语动词
  phrasalVerbs: Idiom[];
  // 词族
  word_family?: WordFamilyItem[];
}

export interface Exclamation {
  form: string;
  label?: string;
  definition: string;
  definition_chn: string;
  examples?: Example[];
}

export interface SynonymDetail {
  word: string;
  label?: string;
  definition: string;
  definition_chn: string;
  examples: Example[];
  note?: string;
  example?: Example;
}

export interface Synonyms {
  title: string;
  synonyms_list: string[];
  explanation: string;
  details: SynonymDetail[];
  patterns: string[];
}

export interface PronunciationPracticeWord {
  word: string;
  pronunciation: {
    uk?: string;
    uk_audio_url?: string;
    us?: string;
    us_audio_url?: string;
  };
}

// 扩展支持的词性接口
export interface DictionaryEntry {
  word: string;
  entry_number?: string; // 用于存储单词条目编号，如well_2中的'2'
  star?: string;
  pronunciation: PronunciationDetail;
  parts_of_speech: string[];
  noun?: PartOfSpeech;
  verb?: PartOfSpeech;
  adjective?: PartOfSpeech;  // 形容词
  adverb?: PartOfSpeech;     // 副词
  preposition?: PartOfSpeech; // 介词
  conjunction?: PartOfSpeech; // 连词
  pronoun?: PartOfSpeech;    // 代词
  exclamation?: Exclamation; // 感叹词
  determiner?: PartOfSpeech; // 限定词
  auxiliary?: PartOfSpeech;  // 助动词
  modal?: PartOfSpeech;      // 情态动词
  prefix?: PartOfSpeech;     // 前缀
  suffix?: PartOfSpeech;     // 后缀
  abbreviation?: PartOfSpeech; // 缩写词
  symbol?: PartOfSpeech;     // 符号
  synonyms?: Synonyms;
  pronunciation_practice: {
    words: PronunciationPracticeWord[];
  };
  word_forms?: string[]; // 存储单词变形的字段;
}
