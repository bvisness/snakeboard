import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/App';

if (window.NetworkTables) {
	const domContainer = document.querySelector('#react-root');
	ReactDOM.render(<App />, domContainer);
} else {
	const nope = document.querySelector('#nope')
	nope.textContent = 'Failed to initialize NetworkTables. Check the console for more details.';
	nope.classList.remove('hide');
}
