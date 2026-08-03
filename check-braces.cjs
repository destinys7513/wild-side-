const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\adelm\\Downloads\\wild side\\artifacts\\wild-rift\\src\\pages\\Admin.tsx', 'utf8');

let inTemplate = false;
let inSingleQuote = false;
let inDoubleQuote = false;
let templateBraces = 0;
let stringBraces = 0;

for (let i = 0; i < content.length; i++) {
  const c = content[i];
  
  // Handle escapes
  if (c === '\\' && (inSingleQuote || inDoubleQuote || inTemplate)) {
    i++; // skip next char
    continue;
  }
  
  if (c === '`' && !inSingleQuote && !inDoubleQuote) {
    inTemplate = !inTemplate;
  } else if (c === "'" && !inTemplate && !inDoubleQuote) {
    inSingleQuote = !inSingleQuote;
  } else if (c === '"' && !inTemplate && !inSingleQuote) {
    inDoubleQuote = !inDoubleQuote;
  } else if ((c === '{' || c === '}') && (inTemplate || inSingleQuote || inDoubleQuote)) {
    if (c === '{') {
      if (inTemplate) templateBraces++;
      else stringBraces++;
    } else {
      if (inTemplate) templateBraces--;
      else stringBraces--;
    }
  }
}

console.log('Template braces net:', templateBraces);
console.log('String braces net:', stringBraces);