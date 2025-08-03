# 《牛津高阶英汉双解词典》(第10版) HTML结构特征总结

## 一、通用HTML结构模式

所有词条文件遵循统一的基本结构，主要包含以下核心组件：

```html
<link rel="stylesheet" type="text/css" href="O8C.css">
<span class="entry">
  <span class="h-g"> <!-- 标题组 -->
    <span class="top-g"> <!-- 顶部组 -->
      <span class="h">单词</span> <!-- 词条标题 -->
      <span class="ei-g"> <!-- 发音组 -->
        <span class="phon-gb">英式发音</span>
        <a class="fayin"> <!-- 发音链接 -->
          <img src="uk_pron.png">
        </a>
        <span class="z_phon-us">NAmE</span>
        <span class="phon-us">美式发音</span>
        <a class="fayin">
          <img src="us_pron.png">
        </a>
      </span>
      <span class="pos-g"> <!-- 词性组 -->
        <a href="#" class="pos">词性1</a>,
        <a href="#" class="pos">词性2</a>, ...
      </span>
    </span>
    <span class="infl"> <!-- 变形组 -->
      <span class="inflection">变形1</span>
      <span class="inflection">变形2</span>, ...
    </span>
  </span>

  <!-- 各词性详细内容 -->
  <a name="词性锚点"></a>
  <span class="p-g"> <!-- 词性组 -->
    <span class="block-g">
      <span class="pos-g">
        <span class="pos">词性</span>
        <span class="symbols-small_coresym">★</span> <!-- 核心词标记 -->
      </span>
    </span>
    <span class="ei-g"> <!-- 词性发音组 -->
      <!-- 发音信息 -->
    </span>
    <span class="ifs-g"> <!-- 变形信息组 -->
      <!-- 变形信息 -->
    </span>
    <span class="n-g"> <!-- 义项组 -->
      <span class="z_n">义项编号</span>
      <span class="gr"> <!-- 语法信息 -->
        <span class="z_gr_br">[</span>语法类型<span class="z_gr_br">]</span>
      </span>
      <span class="def-g"> <!-- 定义组 -->
        <span class="d">英文定义</span>
        <span class="chn">中文定义</span>
      </span>
      <span class="cf"> <!-- 搭配组 -->
        <span class="swung-dash">单词</span>搭配模式
      </span>
      <span class="x-g"> <!-- 例句组 -->
        <span class="symbols-xsym">◆</span>
        <span class="x">英文例句</span>
        <span class="tx">中文翻译</span>
      </span>
    </span>
  </span>
</span>
```

## 二、不同词性的特殊结构特征

### 1. 动词 (verb)
- 包含过去式(took)、过去分词(taken)等变形信息
- 语法标记包含及物(transitive)、不及物(intransitive)等
- 常见搭配模式标记为`<span class="cf">`
- 核心动词标记为`<span class="symbols-coresym">★</span>`

### 2. 名词 (noun)
- 包含复数形式变形信息
- 语法标记包含可数(countable)、不可数(uncountable)等
- 部分名词有词族信息

### 3. 形容词 (adjective)
- 包含比较级和最高级变形信息
- 部分形容词有反义词信息
- 可与介词搭配使用的信息

### 4. 副词 (adverb)
- 部分副词有比较级和最高级变形信息
- 位置说明信息

### 5. 介词 (preposition)
- 通常没有变形信息
- 有大量搭配用法示例
- 部分介词有习语用法

### 6. 限定词 (determiner)
- 包含单复数形式
- 有特定的使用场景说明

### 7. 代词 (pronoun)
- 包含主格、宾格等形式
- 有明确的指代说明

### 8. 连词 (conjunction)
- 通常没有变形信息
- 有连接用法说明

### 9. 情态动词 (modal verb)
- 没有变形信息
- 有特定的语法用法说明

## 三、特殊词条类型的结构特征

### 1. 缩写词 (如 a.m.)
- 标题包含缩写形式和完整形式
- 有与对应词(如 p.m.)的比较信息

### 2. 前缀词 (如 over-)
- 标题包含连字符
- 有多个含义和相关示例词汇
- 没有变形信息

### 3. 复合形容词 (如 -enabled)
- 标题以连字符开头
- 有特定领域(如计算机)的标签信息

### 4. 感叹词 (interjection)
- 通常简短
- 有情感表达说明

## 四、词条的核心组件特征

### 1. 发音组件
- 包含英式和美式两种发音
- 使用国际音标表示
- 有音频链接

### 2. 变形组件
- 不同词性有不同的变形类型
- 动词: 现在式、过去式、过去分词、现在分词
- 名词: 复数形式
- 形容词/副词: 比较级、最高级

### 3. 定义组件
- 英文定义在前，中文定义在后
- 核心定义有标记

### 4. 例句组件
- 英文例句在前，中文翻译在后
- 有典型性标记

### 5. 搭配组件
- 标记了单词的常见搭配模式
- 有示例说明

## 五、结构层次关系

整体结构呈现清晰的层次关系：
- 词条级别 (`entry`)
- 标题级别 (`h-g`)
- 词性级别 (`p-g`)
- 义项级别 (`n-g`)
- 定义/例句级别 (`def-g`/`x-g`)

每个级别都有明确的CSS类名标识，便于解析和提取信息。

## 六、其他特征

1. 核心词标记: `<span class="symbols-coresym">★</span>`
2. 次核心词标记: `<span class="symbols-small_coresym">★</span>`
3. 示例标记: `<span class="symbols-xsym">◆</span>`
4. 语法信息标记: 如 `[transitive]`, `[uncountable]`
5. 习语标记: 部分词条包含习语信息
6. 词族信息: 部分词条包含相关词汇信息
7. 近义词：xr-g symbols-synsym 反义词 xr-g  symbols-oppsym

此总结基于对lib目录下所有文件的分析，涵盖了主要词性和特殊词条类型的结构特征，为后续开发解析器提供了基础参考。