import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { MDX } from 'js-mdict';

interface DictionaryEntry {
  word: string;
  definition: string;
}

class MdxToSqliteConverter {
  private db: Database.Database;
  private mdict: MDX;
  
  constructor(
    private mdxPath: string,
    private dbPath: string
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
      
      CREATE TABLE IF NOT EXISTS oxfordO9C (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        definition TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_word ON oxfordO9C(word);
    `);
  }

  public async convert(): Promise<void> {
    console.log(`Converting ${path.basename(this.mdxPath)} to SQLite...`);

    // 准备SQL语句
    const insert = this.db.prepare(`
      INSERT OR IGNORE INTO oxfordO9C 
      (word, definition)
      VALUES (?, ?)
    `);

    // 获取所有词条（根据js-mdict实际API调整）
    const wordList = this.mdict.keywordList;
    const totalWords = wordList.length;
    let processed = 0;

    console.log(`Found ${totalWords} words`);

    // 处理每个词条
    for (const word of wordList) {
      try {
        const record = this.mdict.lookup(word.keyText);
        // @ts-ignore
        const entry = this.processEntry(word, record.definition);
        
        insert.run(
          word.keyText,
          entry.definition
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
   * 处理词条内容
   */
  private processEntry(word: string, definition: string): DictionaryEntry {
    return {
      word,
      definition,
    };
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


const mdxPath = path.resolve(`./dict/source/oxfordO9C/牛津高阶英汉双解词典（第9版）.mdx`);
const dbPath = path.resolve(`./dict/db/oxfordO9C.db`);

if (!fs.existsSync(mdxPath) || !fs.existsSync(path.dirname(dbPath))) {
  console.error(`错误: 文件 ${mdxPath} 不存在`);
  process.exit(1);
}

const converter = new MdxToSqliteConverter(mdxPath, dbPath);
converter.convert().catch(err => {
  console.error('转换过程中出错:', err);
  process.exit(1);
});