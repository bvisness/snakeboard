import React, { useContext } from 'react';
import classnames from 'classnames';

import { NTConnection } from '/context/NTConnection';

function Indicator(props) {
	return (
		<div className={ classnames('indicator', { on: props.val }) }>
			{ props.label }: <div className="light" />
		</div>
	);
}

export function ConnectionIndicators() {
	const connections = useContext(NTConnection);

	return (
		<div className="connections">
		  <Indicator label="Server Connected" val={ connections.server } />
		  <Indicator label="Robot Connected" val={ connections.robot } />
		</div>
	);
}
