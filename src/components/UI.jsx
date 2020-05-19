import React from 'react';
import _ from 'lodash';
import '../styles.scss';


class UI extends React.Component {
  constructor() {
    super();
    this.clickMe = this.clickMe.bind(this);
  }

  clickMe() {
    // call parent function that manages state
    const { clickEvent } = this.props;
    clickEvent(clickEvent);
  }

  render() {
    const { gameCount, gamesCount } = this.props;
    return (
      <div className={gameCount ? 'ui ui--visible' : 'ui ui--hidden'}>
        <div className="ui-box">
          <h1 className="ui-title">Tiles Game</h1>
          <h3>Match all pairs of colours on the board.</h3>
          <div className="ui-stats">
            Score:
            {' '}
            <strong className="ui-number">{gamesCount}</strong>
          </div>
          <button
            className="ui-shuffle-button"
            onClick={this.clickMe}
            type="button"
          >
            Play
          </button>
        </div>
      </div>
    );
  }
}

export default UI;
