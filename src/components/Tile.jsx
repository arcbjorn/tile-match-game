import React from 'react';
import _ from 'lodash';
import '../styles.scss';

class Tile extends React.Component {
  constructor() {
    super();
    this.clickMe = this.clickMe.bind(this);
  }

  clickMe() {
    const { clickEvent, status, index } = this.props;
    // call parent function that manages state
    if (status === 'unselected') {
      clickEvent(index);
    } else {
      console.log(status);
    }
  }

  render() {
    const { index, type, status } = this.props;
    return (
      <div
        data-index={index}
        data-tiletype={type}
        onKeyDown={this.clickMe}
        tabIndex="0"
        onClick={this.clickMe}
        role="button"
        className={`tile tile--${type} tile--${status}`}
      >
        <div className="tile-inner">
          <div className="tile-face tile-front" />
          <div className="tile-face tile-back" />
        </div>
      </div>
    );
  }
}

export default Tile;
