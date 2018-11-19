"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const defaultRegistry = {
    componentIndex: {},
    knownExtensionPoints: {}
};
exports.AnnexContext = React.createContext(defaultRegistry);
const Blank = () => null;
exports.initRegistry = (index) => {
    const selectedRegistry = index || defaultRegistry;
    const registry = {
        append: (key, RegisteredComponent) => {
            registry.replace(key, (props) => {
                const { DefaultContent } = props;
                return (React.createElement(React.Fragment, null,
                    React.createElement(DefaultContent, Object.assign({}, props)),
                    React.createElement(RegisteredComponent, Object.assign({}, props))));
            });
        },
        hide: (key) => {
            registry.replace(key, Blank);
        },
        prepend: (key, RegisteredComponent) => {
            registry.replace(key, (props) => {
                const { DefaultContent } = props;
                return (React.createElement(React.Fragment, null,
                    React.createElement(RegisteredComponent, Object.assign({}, props)),
                    React.createElement(DefaultContent, Object.assign({}, props))));
            });
        },
        replace: (key, RegisteredComponent) => {
            if (selectedRegistry.componentIndex[key]) {
                throw new Error(`Component already registered for target "${key}", cannot register multiple components for the same extension point in the same extension registry.`);
            }
            selectedRegistry.componentIndex[key] = RegisteredComponent;
        }
    };
    return registry;
};
exports.register = (key) => {
    return (DefaultContent) => (props) => (React.createElement(exports.AnnexContext.Consumer, null, (registry) => {
        if (!registry.componentIndex[key]) {
            return React.createElement(DefaultContent, Object.assign({}, props));
        }
        const Comp = registry.componentIndex[key];
        return React.createElement(Comp, Object.assign({}, props, { DefaultContent: DefaultContent }));
    }));
};
//# sourceMappingURL=index.js.map