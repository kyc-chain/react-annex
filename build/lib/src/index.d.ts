/// <reference types="react" />
import * as React from "react";
export declare const AnnexContext: React.Context<{
    componentIndex: {};
    knownExtensionPoints: {};
}>;
export declare const initRegistry: (index?: {
    componentIndex: {
        [key: string]: React.StatelessComponent<{}> | React.ComponentClass<{}>;
    };
    knownExtensionPoints: {
        [key: string]: boolean;
    };
} | undefined) => {
    register: (key: string, RegisteredComponent: React.StatelessComponent<{}> | React.ComponentClass<{}>) => void;
    hide: (key: string) => void;
};
export declare const replace: (key: string) => (DefaultContent: React.StatelessComponent<{}> | React.ComponentClass<{}>) => (props: any) => JSX.Element;
