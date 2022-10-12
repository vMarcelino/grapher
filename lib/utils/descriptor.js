"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Descriptor(func) {
    const ArgWrapper = (...args) => {
        const Wrapper = (target, propertyKey) => {
            // console.debug('Installing decorator at object property', propertyKey)
            const firstRun = (isGet) => {
                // console.debug(`firstRun(${isGet}) created`)
                return function (newValue) {
                    // console.debug('firstRun triggered!')
                    if (!Object.getOwnPropertyDescriptor(this, propertyKey)) {
                        // console.debug('Installing decorator at instance property', propertyKey)
                        const { getter, setter } = func(target, propertyKey, args);
                        Object.defineProperty(this, propertyKey, {
                            get: getter,
                            set: setter,
                            enumerable: true,
                            configurable: true
                        });
                    }
                    if (isGet) {
                        return this[propertyKey];
                    }
                    else {
                        this[propertyKey] = newValue;
                    }
                };
            };
            Object.defineProperty(target, propertyKey, {
                get: firstRun(true),
                set: firstRun(false),
                enumerable: true,
                configurable: false
            });
        };
        return Wrapper;
    };
    return ArgWrapper;
}
exports.default = Descriptor;
//# sourceMappingURL=descriptor.js.map