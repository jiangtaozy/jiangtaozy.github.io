// markdown-it
var hljs = window.hljs;
var md = window.markdownit({
  html: true,
  linkify: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        // Do nothing
      }
    } else {
      return str;
    }
  }
});

// util function
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

  getInitialState: function() {
    console.log('getInitialState is called');
    return {
      contentsArray: [],
      markdownBodyArray: [createMarkup('正在加载中，请您稍候！')],
    };
  },

  render: function() {
    console.log('render is called, state: ', this.state);
    var slideArray = this.state.markdownBodyArray.map(function(markdownBody, index, slideArray) {
        return <div key={'slide' + index} className="slide markdown-body" dangerouslySetInnerHTML={markdownBody} />;
    });
    return (
        <div>
            <div id="fullpage">
                <div className="section fp-auto-height">
                    {slideArray}
                </div>
            </div>
        </div>
    );
  },

  componentDidUpdate: function() {
    console.log('componentDidUpdate is called');
  },

  componentWillMount: function() {
    console.log('componentWillMount is called');
  },

  componentDidMount: function() {
    console.log('componentDidMount is called');
    var that = this;
    fetch(this.props.bookPath + this.props.bookContents)
    .then(function(response) {
      return response.text();
    }).then(function(body) {
      var contentsArray = body.split('\n');
      while(contentsArray[contentsArray.length - 1].length == 0) {
        contentsArray.pop();
      }
      contentsArray.sort(compare);
      that.setState({
        contentsArray: contentsArray,
      });
    }).then(function() {
      var fatchMarkupBodyTaskArray = that.state.contentsArray.map(function(content, index) {
        return fetch(that.props.bookPath + content).then(function(response) {
          return response.text();
        }).then(function(body) {
          var htmlBody = md.render(body);
          var markupBody = createMarkup(htmlBody);
          var markdownBodyArray = that.state.markdownBodyArray;
          markdownBodyArray[index] = markupBody; 
          that.setState({
            markdownBodyArray: markdownBodyArray,
          });
        });
      });
      Promise.all(fatchMarkupBodyTaskArray).then(function() {
        // fullpage
        $('#fullpage').fullpage({
            loopHorizontal: false,
            scrollOverflow: true,
            paddingBottom: '60px',
        });
      });
    });
  },
});

ReactDOM.render(
  <MarkdownBodyComponent bookPath='res/hacker-book/' bookContents='contents.txt' />,
  document.querySelector(".markdown-body")
);
