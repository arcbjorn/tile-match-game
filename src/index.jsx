import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// eslint-disable-next-line import/extensions
import Board from './components/Board.jsx';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Board />
  </React.StrictMode>,
  document.getElementById('app'),
);

// serviceWorker.unregister();
