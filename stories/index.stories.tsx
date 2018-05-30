import * as React from "react";
import { SFC } from "react";

import { setAddon, storiesOf, Story } from "@storybook/react";
import JSXAddon from "storybook-addon-jsx";
import { withMarkdownNotes } from "@storybook/addon-notes";

import { initRegistry, AnnexContext } from "../src";
import { Demo } from "./components/demo";

setAddon(JSXAddon);

const tStory = storiesOf("Examples", module) as Story & {
  addWithJSX: Function;
};

tStory.addWithJSX(
  "Default content",
  withMarkdownNotes(`
# Default Demo Content

This is the demo content used in all of the following examples, without any overrides registered.
`)(Demo)
);

tStory.addWithJSX(
  "Replacing components",
  withMarkdownNotes(`
  # Simple Component Replacement
  Annex can replace components throughout the application by registering named replacement extension points using the \`replace\` higher-order component:
  ~~~js
  import * as React from "react";
  import { SFC } from "react";
  
  import { replace } from "../../src";
  
  const DefaultContent: SFC<{}> = () => (
    <div>
      <h1>Default Content</h1>
      <p>This is the default content before replacement.</p>
    </div>
  );
  
  export const Replacement: SFC<{}> = replace("replacement")(
    DefaultContent
  );
  ~~~
  The consuming application can then register its own component to be rendered in place of the default component:
  ~~~tsx
  const ReplacementData = () => <div>This has been replaced</div>;
  
  register("replacement", ReplacementData);
  ~~~
  `)(() => {
    const registry = { componentIndex: {}, knownExtensionPoints: {} };
    const { register } = initRegistry(registry);

    const ReplacementData = () => <div>This has been replaced</div>;

    register("replacement", ReplacementData);

    return (
      <AnnexContext.Provider value={registry}>
        <Demo />
      </AnnexContext.Provider>
    );
  })
);

tStory.addWithJSX(
  "Replacing components that receive props",
  withMarkdownNotes(`
  # Component Replacement with Props
  Components registered with a \`replace\` higher-order component will receive the same props as the component they are replacing.
  ~~~js
  import * as React from "react";
  import { SFC } from "react";
  
  import { replace } from "../../src";
  
  const Addition: SFC<{a: number, b: number}> = ({a, b}) => (
    <div>
      <h1>Addition</h1>
      <p>{a} + {b} = {a + b}</p>
    </div>
  );
  
  export const Math: SFC<{}> = replace("math")(
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
  
  register("math", Multiplication);
  ~~~
  `)(() => {
    const registry = { componentIndex: {}, knownExtensionPoints: {} };
    const { register } = initRegistry(registry);

    const Multiplication: SFC<{ a: number; b: number }> = ({ a, b }) => (
      <div>
        <h1>Multiplication</h1>
        <p>
          {a} * {b} = {a * b}
        </p>
      </div>
    );

    register("math", Multiplication);

    return (
      <AnnexContext.Provider value={registry}>
        <Demo />
      </AnnexContext.Provider>
    );
  })
);

tStory.addWithJSX(
  "Hiding components",
  withMarkdownNotes(`
  # Hiding Components
  The \`hide\` function exposed by the registry is helpful syntactic sugar to hide the content of any replaceable component.
  ~~~js
  const registry = { componentIndex: {}, knownExtensionPoints: {} };
  const { hide } = initRegistry(registry);

  hide("math");
  hide("replacement");
  ~~~
  `)(() => {
    const registry = { componentIndex: {}, knownExtensionPoints: {} };
    const { hide } = initRegistry(registry);

    hide("math");
    hide("replacement");

    return (
      <AnnexContext.Provider value={registry}>
        <Demo />
      </AnnexContext.Provider>
    );
  })
);
