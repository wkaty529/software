// updateIcons.js
// 用于在所有文件中替换 Icon 组件为 CustomIcon 组件
// 这是一个示例脚本，需要在Node.js环境中运行

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// 需要处理的文件列表
const filesToProcess = [
  'src/Task_detail.jsx',
  'src/shopping.jsx',
  'src/Setting.jsx',
  'src/Ranking.jsx',
  'src/Private_information.jsx',
  'src/Post_detail.jsx',
  'src/Person_center.jsx',
  'src/Log_in.jsx',
  'src/Index.jsx',
  'src/Group_chat.jsx',
  'src/ExchangeHistory.jsx',
  'src/Create_task.jsx',
  'src/Create_post.jsx',
  'src/Community.jsx',
  'src/AI_assistant.jsx',
  'src/Achievement.jsx',
];

// 替换关键内容
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // 替换导入语句
    let updatedContent = content.replace(
      /import Icon from 'react-native-vector-icons\/MaterialCommunityIcons';/g,
      "import CustomIcon from './components/CustomIcon';"
    );
    
    // 替换Icon组件用法
    updatedContent = updatedContent.replace(
      /<Icon\s+name="([^"]+)"\s+size=\{([^}]+)\}\s+color=\{([^}]+)\}/g,
      '<CustomIcon name="$1" size={$2} color={$3}'
    );
    
    // 还可以添加其他正则表达式来处理更多的替换场景
    
    // 保存修改后的文件
    await writeFile(filePath, updatedContent, 'utf8');
    console.log(`Updated file: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// 处理所有文件
async function updateAllFiles() {
  for (const file of filesToProcess) {
    await processFile(file);
  }
  console.log('All files have been updated.');
}

// 运行主函数
updateAllFiles();

// 使用方法:
// 1. 将此文件保存为 updateIcons.js
// 2. 在终端运行: node updateIcons.js
// 3. 确认所有修改是否正确 