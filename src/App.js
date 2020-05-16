import React from 'react';
import _ from 'lodash';
import './App.scss';

//configure the tiles types
const tileTypes = [
  'tyrianpurple',
  'lightgreen',
  'greensheen',
  'independence',
  'oldburgundy',
  'azure',
  'chinapink',
  'copperred'
];
// configure the difficulty
// by selecting > 2 tilesToMatch
// -> CSS class "tiles" must be "display: flex"
const numTilesToMatch = 2;

class Board extends React.Component{
  constructor(){
		super();
		this.shuffleTiles = this.shuffleTiles.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.countGame = this.countGame.bind(this);
   
    //freeze the selected/matched tile
    this.disableTile = false;
    
		this.state = { 
      tiles : [],
      gamesCount: 0,
      selectedTiles: [],
      gameCount: 1
    };

	}
  
  // setting the board size
  createBoard(tiles, multiplier){
    let multTimes = multiplier - 1;
    let multiplied = tiles;
    for (var i = 0; i < multTimes; i++){
      multiplied = _.concat(multiplied, tiles);
    }
    
    return multiplied;
  }
  
  shuffleTiles(){
    let createdBoard = this.createBoard(tileTypes, numTilesToMatch);
    let shuffledBoard = _.shuffle(createdBoard);
    
    //set each tile to unselected
    let tiles = shuffledBoard.map(function(value){
      return {
        type: value,
        status: 'unselected'
      }
    });

    this.setState({ 
      tiles: tiles,
      gameCount: 0
    });
    
  }
  
  changeSelectedTilesStatus(allTiles, selectedTiles, newStatus){
    for (var v of selectedTiles) {
      allTiles[v].status = newStatus;
    }
    return allTiles;
  }
  
  countGame(){
    let newGamesCount = this.state.gamesCount + 1;
    this.setState({ gamesCount: newGamesCount, gameCount: 1 });
  }
  
  // checking if all tiles are the same
  areTilesMatched(allTiles, selectedTiles, attribute){
    let firstSelectedTile = allTiles[selectedTiles[0]][attribute];
    
    for (var v of selectedTiles) {
      if(allTiles[v][attribute] !== firstSelectedTile){
        return false;
      }
    }

    return true;
  }
  
  
  checkForMatch(currentTiles, currentlySelectedTiles){
      // check all selected tiles for match
    if( this.areTilesMatched(currentTiles, currentlySelectedTiles, 'type') ){
      currentTiles = this.changeSelectedTilesStatus(currentTiles, currentlySelectedTiles, "removed");
        // test if all tiles are matched 
        let winTest =  _.reduce(currentTiles, function(result, value, key) {
          if(result === value.status){
            return result;
          } else {
            return false;
          }
        }, currentTiles[0].status); 
        
        if(winTest !== false){
          this.countGame();
        }

      } else {
        // deselect tiles in case not matched && game is not over
        currentTiles = this.changeSelectedTilesStatus(currentTiles, currentlySelectedTiles, "unselected");
      }
    
      // change currentTiles
      return currentTiles;
  }

  selectTile(index){    
    if (this.disableTile !== true) {

      let currentlySelectedTiles = _.concat(this.state.selectedTiles, index);
      let currentTiles = this.state.tiles;

      currentTiles[currentlySelectedTiles[ currentlySelectedTiles.length - 1 ]].status="selected";

      if (currentlySelectedTiles.length === numTilesToMatch){

          this.setState({
            tiles: currentTiles
          })
        
        //set timeout for 'this' change 
        let _this = this;
        this.disableTile = true;
        
        // timeout to reverse incorrect match
        let pauseGame = setTimeout(function(){ 
          currentTiles = _this.checkForMatch(currentTiles, currentlySelectedTiles);
          currentlySelectedTiles = [];

          _this.disableTile = false;

          _this.setState({
            selectedTiles: currentlySelectedTiles,
            tiles: currentTiles
          })

        }, 500);

      } else {
        currentTiles[currentlySelectedTiles[0]].status = "selected";

        this.setState({
          selectedTiles: currentlySelectedTiles,
          tiles: currentTiles
        })
      }
    }
  }
  
  render(){ 
    let clickEvent = this.selectTile;
    let tileIndex = 0;
      return(
        <div className="tile-board">
          <UI gameCount={this.state.gameCount} gamesCount={this.state.gamesCount} clickEvent={this.shuffleTiles} />
          <div className="tiles">
              {this.state.tiles.map(function(thisTile) {
                return <Tile index={tileIndex++} clickEvent={clickEvent} status={thisTile.status} type={thisTile.type}/>
              })}
          </div>
        </div>
      )
  }
}

class Tile extends React.Component{
 constructor(){
		super();
		this.clickMe = this.clickMe.bind(this);
 }
  clickMe(){
    //call parent function that manages state
    if (this.props.status === 'unselected') {
      this.props.clickEvent(this.props.index);
    } else {
      console.log(this.props.status);
    }
    
  }
 
  render() { 
    return (
      <div data-index = {this.props.index}
      data-tiletype = {this.props.type}
      onClick = {this.clickMe}
      className = {'tile tile--' + this.props.type + ' tile--' + this.props.status}
      > 
        <div className = "tile-inner"> 
            <div className="tile-face tile-front"> 
              
            </div> 
            <div className="tile-face tile-back"> 
                
            </div> 
        </div> 
      </div> 
    ) 
  }
}


class UI extends React.Component{
    constructor(){
		  super();
		  this.clickMe = this.clickMe.bind(this);
    }
  clickMe(){
    //call parent function that manages state
    this.props.clickEvent(this.props.clickEvent);
  }

  render() { 
    return (
      <div className={this.props.gameCount ? "ui ui--visible" : "ui ui--hidden"}>
        <div className="ui-box">
          <h1 className="ui-title">Tiles Game</h1>
          <div className="ui-stats">
            Score: <strong className="ui-number" >{this.props.gamesCount}</strong>
          </div>
          <button className="ui-shuffle-button " onClick={this.clickMe} >Play</button>
        </div>
      </div>
    )
  }
}

export default Board;
