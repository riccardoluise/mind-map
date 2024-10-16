const fs = require('fs');
const path = require('path');

function parseGitignore(rootPath) {
  const gitignorePath = path.join(rootPath, '.gitignore');
  let patterns = [];
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf8');
    patterns = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  }
  patterns.push('node_modules', '.git');
  return patterns;
}

function isIgnored(filePath, ignorePatterns, rootPath) {
  const relativePath = path.relative(rootPath, filePath);
  return ignorePatterns.some(pattern => {
    if (pattern.endsWith('/')) {
      return relativePath.startsWith(pattern) || relativePath + '/' === pattern;
    }
    return relativePath === pattern || relativePath.startsWith(pattern + '/');
  });
}

function walkSync(dir, ignorePatterns, rootPath, filelist = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (isIgnored(filePath, ignorePatterns, rootPath)) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, ignorePatterns, rootPath, filelist);
    } else {
      filelist.push(filePath);
    }
  });

  return filelist;
}

function generateDirectoryTree(rootPath, ignorePatterns) {
  function buildTree(dir) {
    const baseName = path.basename(dir);
    const tree = { name: baseName, type: 'directory', children: [] };
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(rootPath, filePath);
      
      if (isIgnored(filePath, ignorePatterns, rootPath)) {
        return;
      }

      if (fs.statSync(filePath).isDirectory()) {
        tree.children.push(buildTree(filePath));
      } else {
        tree.children.push({ name: file, type: 'file', path: relativePath });
      }
    });

    return tree;
  }

  return buildTree(rootPath);
}

function concatenateFiles(rootPath) {
  const ignorePatterns = parseGitignore(rootPath);
  const files = walkSync(rootPath, ignorePatterns, rootPath);
  let output = '';

  output += "# Project Files Summary\n\n";
  output += "This document contains the content of all project files, excluding those specified in .gitignore, node_modules, and .git.\n\n";
  
  output += "## Directory Structure\n\n";
  output += "```json\n";
  output += JSON.stringify(generateDirectoryTree(rootPath, ignorePatterns), null, 2);
  output += "\n```\n\n";

  output += "## File List\n\n";
  files.forEach((file, index) => {
    const relativePath = path.relative(rootPath, file);
    output += `${index + 1}. ${relativePath}\n`;
  });

  output += "\n## File Contents\n\n";
  files.forEach((file, index) => {
    const relativePath = path.relative(rootPath, file);
    const content = fs.readFileSync(file, 'utf8');
    output += `### ${index + 1}. ${relativePath}\n\n`;
    output += "```\n";
    output += content.trim();
    output += "\n```\n\n";
  });

  fs.writeFileSync('project_files_summary.md', output);
  console.log('Files concatenated successfully in project_files_summary.md');
}

concatenateFiles(process.cwd());