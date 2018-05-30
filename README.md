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
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AnnexContext, initRegistry } from "react-annex";

import { App } from "./app";

// You may call this variable whatever you want
window.__ANNEX_REGISTRY__ = initRegistry();

ReactDOM.render(
  <AnnexContext.Provider>
    <App />
  </AnnexContext.Provider>,
  document.getElementById("app")
);
```

Use the `replace` HOC throughout your application wherever you decide to expose a component for customization:

```tsx
import * as React from "react";
import { SFC } from "react";

import { replace } from "react-annex";

const Greeting: SFC<{ name: string }> = ({ name }) => (
  <p>Yo {name}! What's up?</p>
);

export const CustomizableGreeting = replace("greeting")(Greeting);
```

Create the customization entrypoint in a new project and get the `registry` functions from the property you attached to `window` previously in your app bundle. Use them to hide or replace you customizable components:

```tsx
import * as React from "react";
import { SFC } from "react";

const { hide, register } = window.__ANNEX_REGISTRY__;

const ProfessionalGreeting: SFC<{ name: string }> = ({ name }) => (
  <p>
    Hello {name}, welcome to our app. Please let us know if there's anything we
    can do to help.
  </p>
);

register("greeting", ProfessionalGreeting);
```

Build the customization bundle and embed it in your HTML **after** your main application bundle.

When the application runs, the custom greeting (`ProfessionalGreeting`) will render instead of the application default greeting.

# Development & Contribution

Clone this repo to your machine and run these commands to start the `storybook` development environment:

```bash
yarn
yarn start
```
