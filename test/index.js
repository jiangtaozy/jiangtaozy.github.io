var md = window.markdownit();
function createMarkup(htm) {
  return {__html: htm};
}
function compare(str1, str2) {
  var s1 = str1.substring(0, str1.indexOf('-'));
  var s2 = str2.substring(0, str2.indexOf('-'));
  return s1.localeCompare(s2);
}

// 绑定滑动事件
var touchRegion = new ZingTouch.Region(document.body);
var markdownBodyElement = document.querySelector(".markdown-body");
touchRegion.bind(markdownBodyElement, 'swipe', function(e) {
  console.log('e: ', e);
  console.log('e.detail: ', e.detail);
});

function NoteComponent(htm) {
  return <div dangerouslySetInnerHTML={createMarkup(htm)} />;
}
const path = 'res/hacker-book/'; 
fetch(path + 'contents.txt')
.then(function(response) {
  return response.text();
})
.then(function(body) {
  // console.log('body: ', body);
  var contentsArray = body.split('\n');
  while(contentsArray[contentsArray.length - 1].length == 0) {
    contentsArray.pop();
  }
  contentsArray.sort(compare);
  // console.log('contentsArray: ', contentsArray);  
  fetch(path + contentsArray[0])
  .then(function(response) {
    return response.text();
  })
  .then(function(body) {
    var htm = md.render(body);
    ReactDOM.render(
      NoteComponent(htm),
      document.querySelector(".markdown-body")
    );
  });
});