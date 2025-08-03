import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseHtmlToJson } from '../../src/main.js';

// 获取当前文件路径和目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试解析单个HTML文件
describe('Parser Test', () => {
  test('should parse word.html correctly', () => {
    const htmlPath = path.resolve(__dirname, '../../lib/word.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const result = parseHtmlToJson(html, 'word.html');

    // 验证基本信息
    expect(result.word).toBe('word');
    expect(result.pronunciation.uk.phonetic).not.toBeUndefined();
    expect(result.pronunciation.us.phonetic).not.toBeUndefined();
    expect(result.parts_of_speech).toContain('noun');
    expect(result.parts_of_speech).toContain('verb');
    expect(result.parts_of_speech).toContain('interjection');

    // 验证名词内容
    expect(result.noun).not.toBeUndefined();
    expect(result.noun?.senses.length).toBeGreaterThan(0);
    expect(result.noun?.senses[0].definition).not.toBe('');
    expect(result.noun?.senses[0].definition_chn).not.toBe('');

    // 验证动词内容
    expect(result.verb).not.toBeUndefined();
    expect(result.verb?.senses.length).toBeGreaterThan(0);
    expect(result.verb?.senses[0].definition).not.toBe('');
    expect(result.verb?.senses[0].definition_chn).not.toBe('');

    // 验证单词变形
    expect(result.word_forms).not.toBeUndefined();
    expect(result.word_forms?.length).toBeGreaterThan(0);
  });

  test('should parse good.html correctly', () => {
    const htmlPath = path.resolve(__dirname, '../../lib/good.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const result = parseHtmlToJson(html, 'good.html');

    // 验证基本信息
    expect(result.word).toBe('good');
    expect(result.pronunciation.uk.phonetic).not.toBeUndefined();
    expect(result.pronunciation.us.phonetic).not.toBeUndefined();
    expect(result.parts_of_speech).toContain('adjective');
    expect(result.parts_of_speech).toContain('noun');
    expect(result.parts_of_speech).toContain('adverb');

    // 验证形容词内容
    expect(result.adjective).not.toBeUndefined();
    expect(result.adjective?.senses.length).toBeGreaterThan(0);
    expect(result.adjective?.senses[0].definition).not.toBe('');
    expect(result.adjective?.senses[0].definition_chn).not.toBe('');

    // 验证单词变形
    expect(result.word_forms).not.toBeUndefined();
    expect(result.word_forms?.includes('better')).toBeTruthy();
    expect(result.word_forms?.includes('best')).toBeTruthy();
  });
});