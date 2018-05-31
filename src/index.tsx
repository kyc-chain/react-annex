import * as React from 'react';
import { ComponentClass, SFC } from 'react';

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
		replace: (key: string, RegisteredComponent: ComponentClass | SFC) => {
			if (selectedRegistry.componentIndex[key]) {
				throw new Error(
					`Component already registered for target "${key}", cannot register multiple components for the same extension point in the same extension registry.`
				);
			}

			selectedRegistry.componentIndex[key] = RegisteredComponent;
		},
		hide: (key: string) => {
			registry.replace(key, Blank);
		},
		prepend: (key: string, RegisteredComponent: ComponentClass | SFC) => {
			registry.replace(key, (props: any) => {
				const { DefaultContent } = props;
				return (
					<>
						<RegisteredComponent {...props} />
						<DefaultContent {...props} />
					</>
				);
			});
		},
		append: (key: string, RegisteredComponent: ComponentClass | SFC) => {
			registry.replace(key, (props: any) => {
				const { DefaultContent } = props;
				return (
					<>
						<DefaultContent {...props} />
						<RegisteredComponent {...props} />
					</>
				);
			});
		}
	};

	return registry;
};

export const register = (key: string) => {
	return (DefaultContent: ComponentClass | SFC) => (props: any) => (
		<AnnexContext.Consumer>
			{(registry: ExtensionRegistry) => {
				if (!registry.componentIndex[key]) {
					return <DefaultContent {...props} />;
				}

				const Comp = registry.componentIndex[key];

				return <Comp {...props} DefaultContent={DefaultContent} />;
			}}
		</AnnexContext.Consumer>
	);
};
