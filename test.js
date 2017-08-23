var fs = require('fs');
var contents = fs.readFileSync('./res/hacker-book/contents.txt').toString();
// console.log('contents: ', contents);
var contentsArray = contents.split('\n');
// console.log('contentsArray: ', contentsArray);
while(contentsArray[contentsArray.length - 1].length == 0) {
  contentsArray.pop();
}
// console.log('contentsArray.length: ', contentsArray.length);  
var count = 0;
function compare(str1, str2) {
  // console.log(str1, '.indexOf(\'-\'): ', str1.indexOf('-'));
  var s1 = str1.substring(0, str1.indexOf('-'));
  var s2 = str2.substring(0, str2.indexOf('-'));
  // console.log(s1, ':', s2, '=', s1.localeCompare(s2), ' ', count++);
  return s1.localeCompare(s2);
}
contentsArray.sort(compare);
console.log('contentsArray: ', contentsArray);  

