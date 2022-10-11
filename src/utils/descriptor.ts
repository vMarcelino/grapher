export default function Descriptor<T_obj, T_get, T_set, T_args extends Array<any>>(func: (target: T_obj, propertyKey: string, args: T_args) => { getter: (this: T_obj) => T_get, setter?: (this: T_obj, value: T_set) => void }) {
    const ArgWrapper = (...args: T_args) => {
        const Wrapper = (target: T_obj, propertyKey: string) => {
            // console.debug('Installing decorator at object property', propertyKey)
            const firstRun = (isGet: boolean) => {
                // console.debug(`firstRun(${isGet}) created`)
                return function (this: T_obj, newValue?: T_set) {
                    // console.debug('firstRun triggered!')
                    if (!Object.getOwnPropertyDescriptor(this, propertyKey)) {
                        // console.debug('Installing decorator at instance property', propertyKey)

                        const { getter, setter } = func(target, propertyKey, args)

                        Object.defineProperty(this, propertyKey, {
                            get: getter,
                            set: setter,
                            enumerable: true,
                            configurable: true
                        })
                    }
                    if (isGet) {
                        return (this as any)[propertyKey]
                    } else {
                        (this as any)[propertyKey] = newValue
                    }
                }
            }

            Object.defineProperty(target, propertyKey, {
                get: firstRun(true),
                set: firstRun(false),
                enumerable: true,
                configurable: false
            })
        }
        return Wrapper
    }
    return ArgWrapper
}