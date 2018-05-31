import * as React from 'react';
import { SFC } from 'react';

import { Math } from './math';
import { Replacement } from './replacement';

export const Demo: SFC<{}> = () => (
	<div>
		<Replacement />
		<hr />
		<Math a={12} b={3} />
	</div>
);
