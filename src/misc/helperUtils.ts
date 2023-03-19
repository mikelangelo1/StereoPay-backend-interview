import { NoInfer } from './types/helperTypes';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const helperUtils = {
  uuid: {
    getUniqueId() {
      return uuidv4();
    },
  },

  enumContains(enumObject: any, val: any) {
    for (const valId in enumObject) {
      if (val === enumObject[valId]) {
        return true;
      }
    }

    return false;
  },

  createLookup<T, V extends string | number>(
    arr: T[],
    predicate: (val: T) => V,
  ) {
    const lookup: { [key in V]: T } = {} as any;
    arr.forEach((val) => {
      lookup[predicate(val)] = val;
    });

    return lookup;
  },

  createSet<T>(arr: T[]) {
    const set = new Set<T>();
    arr.forEach((val) => {
      set.add(val);
    });
    return set;
  },

  assignObjectSafely<
    T extends O = never,
    O extends Record<string, unknown> = never,
  >(target: NoInfer<T>, obj: NoInfer<O>, allowedFields: (keyof T)[]) {
    const allowedFieldSet = new Set(allowedFields);

    const clonedObj = _.clone(obj);
    for (const key in clonedObj) {
      if (!allowedFieldSet.has(key)) {
        delete clonedObj[key];
      }
    }

    const res = Object.assign(target, clonedObj);
    return res;
  },
};
