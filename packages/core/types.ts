export type RootConfig = {
  base?: Plugin[];
  plugins?: Plugin[];
  sections?: Plugin[];
  config?: any;
};

export interface Plugin<T = any> extends Function {
  dispose?: Function;
  load?: Function;
  new (...args: any[]): T;
}

export type AllModule = {
  base: Plugin[];
  plugins: Plugin[];
  sections: Plugin[];
};

export type ModuleLoader = { handler: Function; key: string };
