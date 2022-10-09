import { describe, it, expect } from "vitest";
import { createApp } from "../module";
import { Module, InjectModel } from "../decorator";
describe("module", () => {
  it("register single module", () => {
    let { Root, App, moduleMap } = createApp();

    @Module("test")
    class TestModule {
      name = "testModule";
      constructor() {}
    }
    @Root({
      base: [TestModule],
    })
    class Child extends App {
      constructor() {
        super();
      }
    }
    expect(moduleMap.size).toBe(1);
    expect(new Child().modules.get("test")?.name).toBe("testModule");
  });

  it("multiple module", () => {
    let { Root, App, moduleMap } = createApp();

    @Module("A")
    class ModuleA {
      name = "name from ModuleA";
      constructor() {}
    }

    @Module("B")
    class ModuleB {
      constructor(@InjectModel("A") public moduleA: ModuleA) {}
      exec() {
        return this.moduleA.name;
      }
    }
    @Root({
      base: [ModuleA, ModuleB],
    })
    class Child extends App {
      constructor() {
        super();
      }
    }
    expect(moduleMap.size).toBe(2);
    expect((moduleMap.get("B") as any)?.exec()).toBe("name from ModuleA");
  });

  it("use modules which are  not resolved", () => {
    let { Root, App, moduleMap } = createApp();

    @Module("A")
    class ModuleA {
      name = "name from ModuleA";
      constructor() {}
    }

    @Module("B")
    class ModuleB {
      constructor(@InjectModel("A") public moduleA: ModuleA) {}
      exec() {
        return this.moduleA.name;
      }
    }
    expect(() => (Root({ base: [ModuleB, ModuleA] }) as any)()).toThrowError(
      /hasn't been resolved/
    );
  });
  it("resolve multiple modules with the same name ", () => {
    expect(() => {
      let { Root, App, moduleMap } = createApp();

      @Module("A")
      class ModuleA {}

      @Module("A")
      class ModuleB {}
      @Root({
        base: [ModuleA, ModuleB],
      })
      class Child extends App {
        constructor() {
          super();
        }
      }
    }).toThrowError(/A has been resolved/);
  });
});
