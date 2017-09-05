var md = window.markdownit();
function createMarkup(htm) {
  return {__html: htm};
}
function compare(str1, str2) {
  var s1 = str1.substring(0, str1.indexOf('-'));
  var s2 = str2.substring(0, str2.indexOf('-'));
  return s1.localeCompare(s2);
}
const defaultState = { index: 0, cycleLength: 1 };
const reducer = function (state = defaultState, action) {
  switch (action.type) {
    case 'LEFT':
      return Object.assign({}, state, {
        index: (state.index + 1 + state.cycleLength) % state.cycleLength
      });
    case 'RIGHT':
      return Object.assign({}, state, {
        index: (state.index - 1 + state.cycleLength) % state.cycleLength
      });
    case 'SET_CYCLE_LENGTH':
      return Object.assign({}, state, {
        cycleLength: action.payload
      });
    default:
      return state;
  }
};

let store = window.Redux.createStore(reducer);
var MarkdownBodyComponent = React.createClass({
  propTypes: {
    bookPath: React.PropTypes.string.isRequired,
    bookContents: React.PropTypes.string.isRequired,
  },
  getInitialState: function() {
    console.log('getInitialState is called');
    var that = this;
    fetch(this.props.bookPath + this.props.bookContents)
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
      store.dispatch({
        type: 'SET_CYCLE_LENGTH',
        payload: contentsArray.length
      });
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
    });
    return {
      contentsArray: [],
      currentIndex: 0,
      currentMarkdownBody: createMarkup('正在加载中，请您稍候！'),
    };
  },
  componentDidMount: function() {
    var that = this;
    console.log('componentDidMount is called');
    // subscribe store
    store.subscribe(function() {
      console.log('state: ', store.getState());
      let index = store.getState().index;
      fetch(that.props.bookPath + that.state.contentsArray[index])
      .then(function(response) {
        return response.text();
      })
      .then(function(body) {
        var htm = md.render(body);
        that.setState({
          currentIndex: index,
          currentMarkdownBody: createMarkup(htm),
        })
      });
    });
  },
  render: function() {
    console.log('render is called');
    return <div dangerouslySetInnerHTML={this.state.currentMarkdownBody} />;
  },
});
ReactDOM.render(
  <MarkdownBodyComponent bookPath='res/hacker-book/' bookContents='contents.txt' />,
  document.querySelector(".markdown-body")
);
// bind swipe action
var touchRegion = new ZingTouch.Region(document.body, false, false);
var markdownBodyElement = document.querySelector(".markdown-body");
touchRegion.bind(markdownBodyElement, 'swipe', function(e) {
  console.log('e.detail: ', e.detail);
  console.log('e.detail.data[0].currentDirection: ', e.detail.data[0].currentDirection);
  let currentDirection = e.detail.data[0].currentDirection;
  // top 90, left 180, bottom 270, right 360
  if(currentDirection > 135 && currentDirection < 225) {
    store.dispatch({ type: 'LEFT' });
  } else if(currentDirection < 45 || currentDirection > 315) {
    store.dispatch({ type: 'RIGHT'});
  }
});
// bind tap action
touchRegion.bind(markdownBodyElement, 'tap', function(e) {
  console.log('e.detail: ', e.detail);
  store.dispatch({ type: 'LEFT' });
});
