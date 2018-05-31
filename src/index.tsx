import * as React from 'react';

export interface IExtensionRegistry {
	componentIndex: {
		[key: string]: React.ComponentClass | React.SFC;
	};
}
const defaultRegistry = {
	componentIndex: {},
	knownExtensionPoints: {}
};

export const AnnexContext = React.createContext(defaultRegistry);

const Blank: React.SFC<{}> = () => null;

export const initRegistry = (index?: IExtensionRegistry) => {
	const selectedRegistry: IExtensionRegistry = index || defaultRegistry;

	const registry = {
		append: (
			key: string,
			RegisteredComponent: React.ComponentClass | React.SFC
		) => {
			registry.replace(key, (props: any) => {
				const { DefaultContent } = props;
				return (
					<>
						<DefaultContent {...props} />
						<RegisteredComponent {...props} />
					</>
				);
			});
		},
		hide: (key: string) => {
			registry.replace(key, Blank);
		},
		prepend: (
			key: string,
			RegisteredComponent: React.ComponentClass | React.SFC
		) => {
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
		replace: (
			key: string,
			RegisteredComponent: React.ComponentClass | React.SFC
		) => {
			if (selectedRegistry.componentIndex[key]) {
				throw new Error(
					`Component already registered for target "${key}", cannot register multiple components for the same extension point in the same extension registry.`
				);
			}

			selectedRegistry.componentIndex[key] = RegisteredComponent;
		}
	};

	return registry;
};

export const register = (key: string) => {
	return (DefaultContent: React.ComponentClass | React.SFC) => (props: any) => (
		<AnnexContext.Consumer>
			{(registry: IExtensionRegistry) => {
				if (!registry.componentIndex[key]) {
					return <DefaultContent {...props} />;
				}

				const Comp = registry.componentIndex[key];

				return <Comp {...props} DefaultContent={DefaultContent} />;
			}}
		</AnnexContext.Consumer>
	);
};
