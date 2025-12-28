declare module 'virtual:dashboard/componentConnector' {
  type ComponentConnector = import('./componentConnector').ComponentConnector;

  export const getComponentClientResolver: ComponentConnector['getComponentClientResolver'];
  export const getComponentConfig: ComponentConnector['getComponentConfig'];
  export const getComponentDefaultData: ComponentConnector['getComponentDefaultData'];
  export const getComponentValidator: ComponentConnector['getComponentValidator'];
  export const importComponent: ComponentConnector['importComponent'];
}
