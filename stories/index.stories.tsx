import * as React from 'react';
import { SFC } from 'react';

import { setAddon, storiesOf, Story } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withMarkdownNotes } from '@storybook/addon-notes';

import { initRegistry, AnnexContext } from '../src';
import { Demo } from './components/demo';

setAddon(JSXAddon);

const Multiplication: SFC<{ a: number; b: number }> = ({ a, b }) => (
	<div>
		<h1>Multiplication</h1>
		<p>
			{a} * {b} = {a * b}
		</p>
	</div>
);

const tStory = storiesOf('Examples', module) as Story & {
	addWithJSX: Function;
};

tStory.addWithJSX(
	'Default content',
	withMarkdownNotes(`
# Default Demo Content

This is the demo content used in all of the following examples, without any overrides registered.
`)(Demo)
);

tStory.addWithJSX(
	'Hiding components',
	withMarkdownNotes(`
# Hiding Components
The \`hide\` function exposed by the registry is helpful syntactic sugar to hide the content of any replaceable component.
~~~js
const { hide } = initRegistry();

hide("math");
~~~
    `)(() => {
		const registry = { componentIndex: {}, knownExtensionPoints: {} };
		const { hide } = initRegistry(registry);

		hide('math');

		return (
			<AnnexContext.Provider value={registry}>
				<Demo />
			</AnnexContext.Provider>
		);
	})
);

tStory.addWithJSX(
	'Replacing components',
	withMarkdownNotes(`
  # Simple Component Replacement
  Annex can replace or modify components throughout the application by registering named replacement extension points using the \`register\` higher-order component:
  ~~~js
  import * as React from "react";
  import { SFC } from "react";
  
  import { register } from "react-annex";
  
  const DefaultContent: SFC<{}> = () => (
    <div>
      <h1>Default Content</h1>
      <p>This is the default content before replacement.</p>
    </div>
  );
  
  export const Replacement: SFC<{}> = register("replacement")(
    DefaultContent
  );
  ~~~
  The consuming application can then register its own component to be rendered in place of the default component:
  ~~~tsx
  const ReplacementData = () => <div>This has been replaced</div>;
  
  replace("replacement", ReplacementData);
  ~~~
  `)(() => {
		const registry = { componentIndex: {}, knownExtensionPoints: {} };
		const { replace } = initRegistry(registry);

		const ReplacementData = () => <div>This has been replaced</div>;

		replace('replacement', ReplacementData);

		return (
			<AnnexContext.Provider value={registry}>
				<Demo />
			</AnnexContext.Provider>
		);
	})
);

tStory.addWithJSX(
	'Replacing components that receive props',
	withMarkdownNotes(`
  # Component Replacement with Props
  Components registered with a \`replace\` higher-order component will receive the same props as the component they are replacing.
  ~~~js
  import * as React from "react";
  import { SFC } from "react";
  
  import { register } from "react-annex";
  
  const Addition: SFC<{a: number, b: number}> = ({a, b}) => (
    <div>
      <h1>Addition</h1>
      <p>{a} + {b} = {a + b}</p>
    </div>
  );
  
  export const Math: SFC<{}> = register("math")(
    Addition
  );
  ~~~
  The consuming application can use those props in its own component:
  ~~~tsx
  const Multiplication: SFC<{a: number, b: number} = ({a, b}) => (
      <div>
        <h1>Multiplication</h1>
        <p>{a} * {b} = {a * b}</p>
      </div>
  );
  
  replace("math", Multiplication);
  ~~~
  `)(() => {
		const registry = { componentIndex: {}, knownExtensionPoints: {} };
		const { replace } = initRegistry(registry);

		replace('math', Multiplication);

		return (
			<AnnexContext.Provider value={registry}>
				<Demo />
			</AnnexContext.Provider>
		);
	})
);

tStory.addWithJSX(
	'Appending & prepending components',
	withMarkdownNotes(`
  # Prepending Components
  The \`apppend\` and \`prepend\` functions exposed by the registry are helpers to simplify insertion of components before or after an extensible component while retaining the default content.
  ~~~js
  const { append, prepend } = initRegistry();

  append("replacement", (props: any) => (
    <>
      <h2>Extra Information</h2>
      <p>This is important supplementary information.</p>
    </>
  ));
  prepend("math", Multiplication);
  ~~~
  `)(() => {
		const registry = { componentIndex: {}, knownExtensionPoints: {} };
		const { append, prepend } = initRegistry(registry);

		append('replacement', (props: any) => (
			<>
				<h2>Extra Information</h2>
				<p>This is important supplementary information.</p>
			</>
		));
		prepend('math', Multiplication);

		return (
			<AnnexContext.Provider value={registry}>
				<Demo />
			</AnnexContext.Provider>
		);
	})
);
