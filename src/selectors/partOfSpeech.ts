// 词性分组层级： 1. p-g   词性组 2. sd-g  语义主题组 3. n-g   义项组 4. def-g 义项定义组

// 词性信息选择器
export const POS_SELECTORS = {
  // 基础结构选择器
  posSection: '.p-g',
  anchor: 'a[name]',
  // 语义主题组选择器
  sdgStructure: {
    container: '.sd-g',
    text: '.sd',
    chinese: '.sd .chn'
  },
  // 义项组选择器
  ngStructure: {
    container: '>.n-g, .sd-g>.n-g',
    senseNumber: '.z_n',
    smallStar: '>.symbols-small_coresym',
    grammar: '>.gr',
    countability: '.gram',
  },
  // 义项定义组选择器
  defStructure: {
    container: '>.def-g',
  },
  // 定义和示例选择器
  definition: {
    text: '.d,.ud',
    chinese: '.chn'
  },
  example: {
    group: '.x-g',
    english: '.x',
    chinese: '.tx'
  },
  // 搭配选择器
  collocation: {
    pattern: '.cf'
  },
  // 词性锚点选择器（用于构建动态选择器）
  posAnchorPattern: 'a[name="{anchorName}"] + .p-g'
};
