import * as React from 'react';
import { SFC } from 'react';

import { register } from '../../src';

const Addition: SFC<{ a: number; b: number }> = ({ a, b }) => (
	<div>
		<h1>Addition</h1>
		<p>
			{a} + {b} = {a + b}
		</p>
	</div>
);

export const Math: SFC<{ a: number; b: number }> = register('math')(Addition);
