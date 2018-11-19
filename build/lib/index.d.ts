/// <reference types="react" />
import * as React from 'react';
export interface IExtensionRegistry {
    componentIndex: {
        [key: string]: React.ComponentClass | React.SFC;
    };
}
export declare const AnnexContext: React.Context<any>;
export declare const initRegistry: (index?: IExtensionRegistry | undefined) => {
    append: (key: string, RegisteredComponent: React.ComponentType<{}>) => void;
    hide: (key: string) => void;
    prepend: (key: string, RegisteredComponent: React.ComponentType<{}>) => void;
    replace: (key: string, RegisteredComponent: React.ComponentType<{}>) => void;
};
export declare const register: (key: string) => (DefaultContent: React.ComponentType<{}>) => (props: any) => JSX.Element;
