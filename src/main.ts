import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { DictionaryEntry } from './interfaces.js';
import { extractBasicInfo } from './extractors/extractBasicInfo.js';
import { extractPronunciation } from './extractors/extractPronunciation.js';
import { extractPOSLabels } from './extractors/extractPOSLabels.js';
import { extractPOSContent } from './extractors/extractPOSContent.js';
import { extractSynonyms } from './extractors/extractSynonyms.js';
import { extractPronunciationPractice } from './extractors/extractPronunciationPractice.js';
import { extractWordForms } from './extractors/extractWordForms.js';
import { cleanText } from './utils.js';

/**
 * 解析HTML为JSON
 * @param html HTML内容
 * @param filename 文件名（用于日志）
 * @returns 解析后的词典条目
 */
const parseHtmlToJson = (html: string, filename: string): DictionaryEntry => {
  try {
    const $ = cheerio.load(html);
    const entry: DictionaryEntry = {
      word: '',
      pronunciation: { uk: {}, us: {} },
      parts_of_speech: [],
      pronunciation_practice: { words: [] }
    };

    // 1. 提取基本信息（单词、星级）
    extractBasicInfo($, entry);
    if (!entry.word) {
      // 尝试从文件名提取单词
      entry.word = path.basename(filename, '.html').replace(/[-_.]/g, ' ');
      console.warn(`文件 ${filename} 中未找到单词，从文件名提取: ${entry.word}`);
    }

    // 2. 提取发音信息（英式/美式）
    extractPronunciation($, entry);

    // 3. 提取所有词性标识
    extractPOSLabels($, entry);

    // 4. 提取各类词性内容（通过通用函数处理）
    extractPOSContent($, entry);

    // 5. 提取同义词信息
    extractSynonyms($, entry);

    // 6. 提取发音练习
    extractPronunciationPractice($, entry);

    // 7. 提取单词变形信息
    extractWordForms($.html(), entry);

    return entry;
  } catch (error) {
    console.error(`解析文件 ${filename} 失败:`, error);
    throw error;
  }
};

/**
 * 处理单个文件
 * @param htmlPath HTML文件路径
 * @param outputDir 输出目录
 */
const processFile = (htmlPath: string, outputDir: string): void => {
  try {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const filename = path.basename(htmlPath);
    const result = parseHtmlToJson(html, filename);

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 生成输出文件路径
    const outputPath = path.join(outputDir, `${result.word || path.basename(filename, '.html')}.json`);

    // 写入文件
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`成功解析并保存: ${outputPath}`);
  } catch (error) {
    console.error(`处理文件 ${htmlPath} 失败:`, error);
  }
};

/**
 * 批量处理目录下的所有HTML文件
 * @param inputDir 输入目录
 * @param outputDir 输出目录
 */
const batchProcess = (inputDir: string, outputDir: string): void => {
  try {
    // 读取目录下的所有文件
    const files = fs.readdirSync(inputDir);

    // 过滤出HTML文件
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    console.log(`找到 ${htmlFiles.length} 个HTML文件待处理`);

    // 处理每个HTML文件
    htmlFiles.forEach(file => {
      const htmlPath = path.join(inputDir, file);
      processFile(htmlPath, outputDir);
    });

    console.log(`批量处理完成，共处理 ${htmlFiles.length} 个文件`);
  } catch (error) {
    console.error(`批量处理失败:`, error);
  }
};

// 主函数
const main = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const inputDir = path.resolve(__dirname, '../lib'); // 输入目录
    const outputDir = path.resolve(__dirname, '../dict/demo'); // 输出目录
    let SINGLE_FILE = path.join(inputDir, 'clear.html')

    // 如果定义了单个文件，则只处理单个文件
    processFile(SINGLE_FILE, outputDir)

    // console.log(`开始解析 ${inputDir} 目录下的HTML文件...`);
    // batchProcess(inputDir, outputDir);
  } catch (error) {
    console.error('程序执行失败：', error);
  }
};

main();
