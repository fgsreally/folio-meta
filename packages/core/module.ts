import { FOLIO } from "./common";
import { AllModule, RootConfig, Plugin, ModuleLoader } from "./types";
import "reflect-metadata";

export function createApp() {
  let moduleMap: Map<string, Plugin> = new Map();
  let allModule: AllModule = {
    base: [],
    plugins: [],
    sections: [],
  };

  class ModuleResolver {
    static resolve(opts: RootConfig) {
      opts.base?.forEach(ModuleResolver.moduleHandler("base"));
      opts.plugins?.forEach(ModuleResolver.moduleHandler("plugins"));
      opts.sections?.forEach(ModuleResolver.moduleHandler("sections"));
    }
    static moduleHandler(key: keyof AllModule) {
      return (module: any) => {
        let mName = resolveModuleName(module);
        let params: any[] = Reflect.getMetadata(FOLIO.PROPERTY, module) || [];
        if (mName) {
          if (isResolved(mName)) throw new Error(`${mName} has been resolved`);
          let instance = new module(
            ...params.map((item) => {
              return getModule(item);
            })
          );
          addModule(mName, instance);
          allModule[key].push(instance);
        }
      };
    }
  }

  function Root(params: RootConfig): ClassDecorator {
    return (target: Function) => {
      ModuleResolver.resolve(params);
    };
  }

  function isResolved(key: string) {
    return moduleMap.has(key);
  }
  function addModule(moduleName: string, module: Plugin) {
    moduleMap.set(moduleName, module);
  }

  function resolveModuleName(module: Function) {
    return Reflect.getMetadata(FOLIO.MODULE, module) as string;
  }
  function getModule(moduleName: string) {
    let ret = moduleMap.get(moduleName);
    if (!ret) throw new Error(`module ${moduleName} hasn't been resolved`);
    return ret;
  }

  let App = class implements AllModule {
    base: Plugin[];
    plugins: Plugin[];
    sections: Plugin[];
    modules = moduleMap;
    destructor: ModuleLoader[] = [];
    loader: ModuleLoader[] = [];

    constructor() {
      let { base, plugins, sections } = allModule;
      this.base = base.map(this.collect);
      this.plugins = plugins.map(this.collect);
      this.sections = sections.map(this.collect);
    }
    collect(plugin: Plugin) {
      let key = resolveModuleName(plugin);
      if (plugin.load) this.loader.push({ handler: plugin.load, key });
      if (plugin.dispose)
        this.destructor.unshift({ handler: plugin.dispose, key });
      return plugin;
    }
    loadAll() {
      this.loader.forEach(async (item) => {
        await item.handler();
      });
    }

    disposeAll() {
      this.destructor.forEach(async (item) => {
        await item.handler();
      });
    }
  };
  return { allModule, moduleMap, Root, App };
}
