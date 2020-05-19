import React from 'react';
import _ from 'lodash';
import '../styles.scss';

import Tile from './Tile';
import UI from './UI';

// configure the tiles types
const tileTypes = [
  'tyrianpurple',
  'lightgreen',
  'greensheen',
  'independence',
  'oldburgundy',
  'azure',
  'chinapink',
  'copperred',
];
// configure the difficulty
// by selecting > 2 tilesToMatch
// -> CSS class "tiles" must be "display: flex"
const numTilesToMatch = 2;

class Board extends React.Component {
  constructor() {
    super();
    this.shuffleTiles = this.shuffleTiles.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.countGame = this.countGame.bind(this);

    // freeze the selected/matched tile
    this.disableTile = false;

    this.state = {
      tiles: [],
      gamesCount: 0,
      selectedTiles: [],
      gameCount: 1,
    };
  }

  // setting the board size
  createBoard(tiles, multiplier) {
    const multTimes = multiplier - 1;
    let multiplied = tiles;
    for (let i = 0; i < multTimes; i++) {
      multiplied = _.concat(multiplied, tiles);
    }

    return multiplied;
  }

  shuffleTiles() {
    const createdBoard = this.createBoard(tileTypes, numTilesToMatch);
    const shuffledBoard = _.shuffle(createdBoard);

    // set each tile to unselected
    const tiles = shuffledBoard.map((value) => ({
      type: value,
      status: 'unselected',
    }));

    this.setState({
      tiles,
      gameCount: 0,
    });
  }

  changeSelectedTilesStatus(allOfTiles, selectedTiles, newStatus) {
    const allTiles = allOfTiles;
    for (const v of selectedTiles) {
      allTiles[v].status = newStatus;
    }
    return allTiles;
  }

  countGame() {
    const { gamesCount } = this.state;
    this.setState({ gamesCount: gamesCount + 1, gameCount: 1 });
  }

  // checking if all tiles are the same
  areTilesMatched(allTiles, selectedTiles, attribute) {
    const firstSelectedTile = allTiles[selectedTiles[0]][attribute];

    for (const v of selectedTiles) {
      if (allTiles[v][attribute] !== firstSelectedTile) {
        return false;
      }
    }

    return true;
  }

  checkForMatch(currTiles, currentlySelectedTiles) {
    // check all selected tiles for match
    if (this.areTilesMatched(currTiles, currentlySelectedTiles, 'type')) {
      let currentTiles = currTiles;

      currentTiles = this.changeSelectedTilesStatus(
        currentTiles,
        currentlySelectedTiles,
        'removed',
      );
      // test if all tiles are matched
      const winTest = _.reduce(
        currentTiles,
        (result, value, key) => {
          if (result === value.status) {
            return result;
          }
          return false;
        },
        currentTiles[0].status,
      );

      if (winTest !== false) {
        this.countGame();
      }
    } else {
      // deselect tiles in case not matched && game is not over
      let currentTiles = currTiles;
      currentTiles = this.changeSelectedTilesStatus(
        currentTiles,
        currentlySelectedTiles,
        'unselected',
      );
    }

    // change currentTiles
    return currTiles;
  }

  selectTile(index) {
    if (this.disableTile !== true) {
      const { selectedTiles } = this.state;
      let currentlySelectedTiles = _.concat(selectedTiles, index);
      let { tiles } = this.state;

      tiles[
        currentlySelectedTiles[currentlySelectedTiles.length - 1]
      ].status = 'selected';

      if (currentlySelectedTiles.length === numTilesToMatch) {
        this.setState({
          tiles: tiles,
        });

        // set timeout for 'this' change
        const tempThis = this;
        this.disableTile = true;

        // timeout to reverse incorrect match
        const pauseGame = setTimeout(() => {
          tiles = tempThis.checkForMatch(
            tiles,
            currentlySelectedTiles,
          );
          currentlySelectedTiles = [];

          tempThis.disableTile = false;

          tempThis.setState({
            selectedTiles: currentlySelectedTiles,
            tiles: tiles,
          });
        }, 500);
      } else {
        tiles[currentlySelectedTiles[0]].status = 'selected';

        this.setState({
          selectedTiles: currentlySelectedTiles,
          tiles: tiles,
        });
      }
    }
  }

  render() {
    const clickEvent = this.selectTile;
    const { tiles, gameCount, gamesCount } = this.state;
    let tileIndex = 0;
    return (
      <div className="tile-board">
        <UI
          gameCount={gameCount}
          gamesCount={gamesCount}
          clickEvent={this.shuffleTiles}
        />
        <div className="tiles">
          {tiles.map((thisTile) => (
            <Tile
              index={tileIndex++}
              clickEvent={clickEvent}
              status={thisTile.status}
              type={thisTile.type}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
