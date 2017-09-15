var hljs = window.hljs;
var md = window.markdownit({
  html: true,
  linkify: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {              try {                                              return hljs.highlight(lang, str).value;        } catch (err) {
        // Do nothing
      }
    } else {
      return str;
    }                                              }
});
function createMarkup(htm) {
  return {__html: htm};
}
function compare(str1, str2) {
  var s1 = str1.substring(0, str1.indexOf('-'));
  var s2 = str2.substring(0, str2.indexOf('-'));
  return s1.localeCompare(s2);
}

// react
var MarkdownBodyComponent = React.createClass({
  propTypes: {
    bookPath: React.PropTypes.string.isRequired,
    bookContents: React.PropTypes.string.isRequired,
  },
  getInitialState: initState.bind(this, this.props.bookPath + this.props.bookContents),
  componentDidMount: function() {
    console.log('componentDidMount is called');
    alert('componentDidMount is called');
  },
  render: function() {
    console.log('render is called');
    alert('render is called');
    return <div dangerouslySetInnerHTML={this.state.currentMarkdownBody} />;
  },
});
ReactDOM.render(
  <MarkdownBodyComponent bookPath='res/hacker-book/' bookContents='contents.txt' />,
  document.querySelector(".markdown-body")
);

//var initState = function() {
  //console.log('getInitialState is called');
  //alert('getInitialState is called');
  //var that = this;
var initState = fetch(path)
  .then(function(response) {
    return response.text();
  })
  .then(function(body) {
    var contentsArray = body.split('\n');
    while(contentsArray[contentsArray.length - 1].length == 0) {
      contentsArray.pop();
    }
    contentsArray.sort(compare);
    that.setState({
      contentsArray: contentsArray,
    });
  })
    fetch(that.props.bookPath + that.state.contentsArray[that.state.currentIndex])
    .then(function(response) {
      return response.text();
    })
    .then(function(body) {
      var htm = md.render(body);
      that.setState({
        currentMarkdownBody: createMarkup(htm),
      })
    });
  return {
    contentsArray: [],
    currentIndex: 0,
    currentMarkdownBody: createMarkup('正在加载中，请您稍候！'),
  };
};
