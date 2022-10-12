export default function Descriptor<T_obj, T_get, T_set, T_args extends Array<any>>(func: (target: T_obj, propertyKey: string, args: T_args) => {
    getter: (this: T_obj) => T_get;
    setter?: (this: T_obj, value: T_set) => void;
}): (...args: T_args) => (target: T_obj, propertyKey: string) => void;
