# React-Annex: A runtime extension framework for ReactJS

Developing an enterprise SaaS application with React is easy. Set up a standard build process, webpack all of the things and implement a standard CD process to ship your application bundle to your fleet of production servers. Bliss.

Then a customer wants a customization to their UI. Something that nobody else needs nor wants. This is Enterprise Software - saying "no" is not an option!

So begins the maintenance nightmare of maintaining a custom fork for this customer. Build and deployment processes change as new branches are created for first one customer, then two, then ten. Developers are losing their minds. Customizations are getting merged into `master` by accident left and right!

Nobody needs this kind of stress in their life.

Enter **React-Annex.**

React-Annex allows you to build extension points into your application code and register replacement components, hide components that aren't required or inject entirely new functionality into your app **at runtime**. Ship your standard application bundle and then ship an **annex** - a self-contained file containing customizations for a single instance.

## How it works

In your application bundle you will initialize the registry and attach it to the `window` object. This is required in order for the annex file to register its customizations at runtime. You will also need to wrap your application in the AnnexContext Provider:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AnnexContext, initRegistry } from 'react-annex';

import { App } from './app';

// You may call this variable whatever you want
window.__ANNEX_REGISTRY__ = initRegistry();

ReactDOM.render(
	<AnnexContext.Provider>
		<App />
	</AnnexContext.Provider>,
	document.getElementById('app')
);
```

Use the `register` HOC throughout your application wherever you decide to expose a component for customization:

```tsx
import * as React from 'react';
import { SFC } from 'react';

import { register } from 'react-annex';

const Greeting: SFC<{ name: string }> = ({ name }) => (
	<p>Yo {name}! What's up?</p>
);

export const CustomizableGreeting = register('greeting')(Greeting);
```

Create the customization entrypoint in a new project and get the `registry` functions from the property you attached to `window` previously in your app bundle. Use them to hide, replace or extend your customizable components:

```tsx
import * as React from 'react';
import { SFC } from 'react';

const { replace } = window.__ANNEX_REGISTRY__;

const ProfessionalGreeting: SFC<{ name: string }> = ({ name }) => (
	<p>
		Hello {name}, welcome to our app. Please let us know if there's anything we
		can do to help.
	</p>
);

replace('greeting', ProfessionalGreeting);
```

Build the customization bundle and embed it in your HTML **after** your main application bundle.

When the application runs, the custom greeting (`ProfessionalGreeting`) will render instead of the application default greeting.

## API

### `register`

The `register` function takes a string identifier and returns a higher-order component which receives the default component. Note that it receives the default component as a callable SFC or class constructor, not as a JSX element.

```tsx
const DefaultText = () => <p>This text is customizable!</p>;

export const CustomizableText = register('customizable-text')(DefaultText);
```

### `initRegistry`

Creates a registry object. Optionally can receive an existing registry object in case more than one registry is desirable (e.g. in a testing environment, or in the demo project).

**Default usage (recommended):**

```tsx
// In the main app bundle:
import { AnnexContent, initRegistry } from 'react-annex';

window.__ANNEX_REGISTRY__ = initRegistry();

ReactDOM.render(
	// The provider already has access to the default registry
	<AnnexContext.Provider>
		<App />
	</AnnexContext.Provider>,
	document.getElementById('app')
);

// In the annex bundle:
const { append, hide, prepend, replace } = window.__ANNEX_REGISTRY__;

// Do any modifications here
```

**Advanced usage:**

In this example, two instances of the app will be rendered. The first instance won't render the "welcome" component. This approach is not recommended for production use.

```tsx
const registryObject1 = { componentIndex: {} };
const registry1 = initRegistry(registryObject1);

registry1.hide('welcome');

const registryObject2 = { componentIndex: {} };
const registry2 = initRegistry(registryObject2);

ReactDOM.render(
	// Pass in our first registry object
	<AnnexContext.Provider value={registryObject1}>
		<App />
	</AnnexContext.Provider>,
	document.getElementById('appInstance1')
);

ReactDOM.render(
	// Pass in our second registry object
	<AnnexContext.Provider value={registryObject2}>
		<App />
	</AnnexContext.Provider>,
	document.getElementById('appInstance2')
);
```

### Registry Functions

#### `replace`

The `replace` function exposed by the registry object swaps out the component for a custom replacement specified in the annex bundle. The replacement component will receive the same props as the component it is replacing.

```tsx
// In the application bundle:
import { register, initRegistry } from 'react-annex';

window.__ANNEX_REGISTRY__ = initRegistry();

const Addition: SFC<{ a: number; b: number }> = ({ a, b }) => (
	<p>
		{a} + {b} = {a + b}
	</p>
);

const Math: SFC<{ a: number; b: number }> = register('math')(Addition);

ReactDOM.render(
	// Pass in our first registry object
	<AnnexContext.Provider>
		<Math a={12} b={3} />
	</AnnexContext.Provider>,
	document.getElementById('app')
);

// By default the application will render "12 + 3 = 15"

// In the annex bundle:
const { replace } = window.__ANNEX_REGISTRY__;

const Multiplication: SFC<{ a: number; b: number }> = ({ a, b }) => (
	<p>
		{a} * {b} = {a * b}
	</p>
);

replace('math', Multiplication);

// Now the application will render "12 * 3 = 36"
```

#### `hide`

The `hide` function exposed by the registry object removes the specified component from the app. It accepts a string which identifies a registered customizable component.

```tsx
const { hide } = window.__ANNEX_REGISTRY__;

// Hide the math component for this instance
hide('math');
```

#### `prepend`

The `prepend` function exposed by the registry object inserts a component before the specified component in the app. The inserted component is inserted as a sibling to the target component. Prepended components receive the same props as the components they are inserted before.

```tsx
const { prepend } = window.__ANNEX_REGISTRY__;

const MathWarning = ({ a, b }) => (
	<p>
		Warning: About to do math with {a} and {b}!
	</p>
);

// Add a heading above all instances of math
prepend('math', MathWarning);

// Now the application will render:
//
//   Warning: About to do math with 12 and 3!
//   12 + 3 = 15
```

#### `append`

The `append` function exposed by the registry object inserts a component after the specified component in the app. The inserted component is inserted as a sibling to the target component. Appended components receive the same props as the components they are inserted after.

```tsx
const { prepend } = window.__ANNEX_REGISTRY__;

const MathSummary = ({ a, b }) => (
	<p>
		We did math with {a} and {b}!
	</p>
);

// Add a summary below all instances of math
append('math', MathSummary);

// Now the application will render:
//
//   12 + 3 = 15
//   We did math with 12 and 3!
```

#### Advanced usage of `replace`

Components provided to `replace` will receive the component they are replacing as a prop: `DefaultComponent`.

The `prepend`, `append` and `hide` helpers all use `replace` internally. `replace` can be used with the `DefaultComponent` prop to make complex insertions and modifications around the default implementation while retaining its functionality:

```tsx
const { replace } = window.__ANNEX_REGISTRY__;

const MathFormatter = props => {
	const { a, b, DefaultComponent } = props;

	return (
		<>
			<p>We're about to do math. Our numbers are:</p>
			<ul>
				<li>{a}</li>
				<li>{b}</li>
			</ul>
			<DefaultComponent {...props} />
			<p>
				We did math with {a} and {b}!
			</p>
		</>
	);
};

replace('math', MathFormatter);

// Now the application will render:
//
//   We're about to do math. Our numbers are:
//
//   • 12
//   • 3
//
//   12 + 3 = 15
//   We did math with 12 and 3!
```

The main advantage of this approach is our customization will still work without modification, even if the implementation of the `Math` component changes in the main app bundle.

# Development & Contribution

Clone this repo to your machine and run these commands to start the `storybook` development environment:

```bash
yarn
yarn start
```

This repo uses [commitizen](https://commitizen.github.io/cz-cli/) to ensure clean, consistent commit messages. Please use `git cz` when committing changes.
