import path from 'path';
import fs from 'fs';
import { MDX } from 'js-mdict';

// 1. 加载 MDX 文件
const mdxPath = path.resolve(`./dict/source/oxfordO9C/牛津高阶英汉双解词典（第9版）.mdx`);
const mdict = new MDX(mdxPath);

// 2. 获取词典元信息（头部信息）
const header = mdict.header;
console.log('=== 词典元信息 ===');
console.log(header);

// 3. 遍历词条（可选：限制数量避免卡死）
const wordCount = 5; // 仅查看前5个词条
// @ts-ignore
const keys = mdict.keys.slice(0, wordCount);
console.log('\n=== 词条示例 ===');
keys.forEach(key => {
  // @ts-ignore
  const entry = mdict.lookup(key);
  console.log(`[${key}]`, entry + '...'); // 截取前50字符
});