import * as React from "react";
import { ComponentClass, SFC } from "react";

type ExtensionRegistry = {
  componentIndex: {
    [key: string]: ComponentClass | SFC;
  };
  knownExtensionPoints: {
    [key: string]: boolean;
  };
};

const defaultRegistry = {
  componentIndex: {},
  knownExtensionPoints: {}
};

export const AnnexContext = React.createContext(defaultRegistry);

const Blank: SFC<{}> = () => null;

export const initRegistry = (index?: ExtensionRegistry) => {
  const selectedRegistry: ExtensionRegistry = index || defaultRegistry;

  const registry = {
    register: (key: string, RegisteredComponent: ComponentClass | SFC) => {
      if (selectedRegistry.componentIndex[key]) {
        throw new Error(
          `Component already registered for target "${key}", cannot register multiple components for the same extension point in the same extension registry.`
        );
      }

      selectedRegistry.componentIndex[key] = RegisteredComponent;
    },
    hide: (key: string) => {
      registry.register(key, Blank);
    }
  };

  return registry;
};

export const replace = (key: string) => {
  return (DefaultContent: ComponentClass | SFC) => (props: any) => (
    <AnnexContext.Consumer>
      {(registry: ExtensionRegistry) => {
        if (registry.componentIndex[key]) {
          const Comp = registry.componentIndex[key];

          return <Comp {...props} />;
        }

        return <DefaultContent {...props} />;
      }}
    </AnnexContext.Consumer>
  );
};
