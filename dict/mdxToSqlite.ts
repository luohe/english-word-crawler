import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { MDX } from 'js-mdict';

interface DictionaryEntry {
  word: string;
  definition: string;
  pronunciation?: string;
  examples?: string;
  dictionaryType: string;
}

class MdxToSqliteConverter {
  private db: Database.Database;
  private mdict: MDX;
  
  constructor(
    private mdxPath: string,
    private dbPath: string,
    private dictionaryType: string = path.parse(mdxPath).name
  ) {
    // 验证文件存在
    if (!fs.existsSync(mdxPath)) {
      throw new Error(`MDX file not found: ${mdxPath}`);
    }

    // 初始化数据库
    this.db = new Database(dbPath);
    this.initializeDatabase();
    
    // 初始化MDX解析器
    this.mdict = new MDX(mdxPath);
  }

  private initializeDatabase(): void {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        definition TEXT NOT NULL,
        pronunciation TEXT,
        examples TEXT,
        dictionaryType TEXT NOT NULL,
        UNIQUE(word, dictionaryType)
      );
      
      CREATE INDEX IF NOT EXISTS idx_word ON entries(word);
      CREATE INDEX IF NOT EXISTS idx_dict_type ON entries(dictionaryType);
    `);
  }

  public async convert(): Promise<void> {
    console.log(`Converting ${path.basename(this.mdxPath)} to SQLite...`);

    // 准备SQL语句
    const insert = this.db.prepare(`
      INSERT OR IGNORE INTO entries 
      (word, definition, pronunciation, examples, dictionaryType)
      VALUES (?, ?, ?, ?, ?)
    `);

    // 获取所有词条（根据js-mdict实际API调整）
    const wordList = this.getWordList();
    const totalWords = wordList.length;
    let processed = 0;

    console.log(`Found ${totalWords} words`);

    // 处理每个词条
    for (const word of wordList) {
      try {
        const record = this.mdict.lookup(word);
        // @ts-ignore
        const entry = this.processEntry(word, record.definition);
        
        insert.run(
          entry.word,
          entry.definition,
          entry.pronunciation,
          entry.examples,
          entry.dictionaryType
        );

        // 进度报告
        if (++processed % 5000 === 0 || processed === totalWords) {
          console.log(`Progress: ${processed}/${totalWords} (${
            ((processed / totalWords) * 100).toFixed(1)}%)`);
        }
      } catch (err) {
        console.error(`[ERROR] "${word}": ${err instanceof Error ? err.message : err}`);
      }
    }

    this.finalize();
  }

  /**
   * 获取词表（根据js-mdict实际情况可能需要自定义实现）
   */
  private getWordList(): string[] {
    // 如果js-mdict有直接获取词表的方法则替换此实现
    // 这里假设需要通过其他方式获取词表
    const buffer = fs.readFileSync(this.mdxPath);
    // 简单示例：从文件内容提取单词（实际需要根据MDX格式实现）
    const wordMatches = buffer.toString('ascii').match(/@@@LINK=.+?|[\w'-]+/g);
    return [...new Set(wordMatches || [])]; // 去重
  }

  /**
   * 处理词条内容
   */
  private processEntry(word: string, definition: string): DictionaryEntry {
    return {
      word,
      definition,
      dictionaryType: this.dictionaryType,
      // 以下为可选内容提取
      pronunciation: this.extractPronunciation(definition),
      examples: this.extractExamples(definition)
    };
  }

  private extractPronunciation(html: string): string | undefined {
    const match = html.match(/<span class="pron">\[(.*?)\]<\/span>/);
    return match?.[1];
  }

  private extractExamples(html: string): string | undefined {
    const exMatches = html.match(/<ex>(.*?)<\/ex>/g);
    return exMatches?.map(ex => ex.replace(/<[^>]+>/g, '')).join('\n');
  }

  private finalize(): void {
    this.db.exec(`
      ANALYZE;
      PRAGMA optimize;
    `);
    this.db.close();
    console.log('Conversion completed successfully');
  }
}


const mdxPath = path.resolve(`./dict/oxfordO8C/O8C.mdx`);
const dbPath = path.resolve(`./dict/db/oxfordO8C.db`);

if (!fs.existsSync(mdxPath) || !fs.existsSync(path.dirname(dbPath))) {
  console.error(`错误: 文件 ${mdxPath} 不存在`);
  process.exit(1);
}

const converter = new MdxToSqliteConverter(mdxPath, dbPath);
converter.convert().catch(err => {
  console.error('转换过程中出错:', err);
  process.exit(1);
});