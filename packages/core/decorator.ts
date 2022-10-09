import { FOLIO } from "./common";
import "reflect-metadata";

export function Module(params: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(FOLIO.MODULE, params, target);
  };
}
export function InjectModel(params: string) {
  return (target: Function, propertyKey: string, index: number) => {
    if (Reflect.hasMetadata(FOLIO.PROPERTY, target)) {
      Reflect.getMetadata(FOLIO.PROPERTY, target).unshift(params);
    } else {
      Reflect.defineMetadata(FOLIO.PROPERTY, [params], target);
    }
  };
}
