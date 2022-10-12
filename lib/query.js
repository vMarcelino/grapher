"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.Query = void 0;
const _1 = require(".");
class Query {
    constructor(executionPath) {
        if (executionPath)
            this.executionPath = executionPath;
        else
            this.executionPath = [];
    }
    execute(items) {
        for (const func of this.executionPath) {
            items = func(items);
        }
        return items;
    }
    _createNewQuery(func) {
        return new Query([...this.executionPath, func]);
    }
    throughOutgoingEdge(key) {
        if (!Array.isArray(key))
            key = [key];
        const func = (items) => {
            return items
                .filter((i) => i instanceof _1.GraphNode)
                .map(i => Array.from(i.outgoing)).flat()
                .filter(e => key.includes(e.value))
                .map(e => e.destination);
        };
        return this._createNewQuery(func);
    }
    throughIncomingEdge(key) {
        if (!Array.isArray(key))
            key = [key];
        const func = (items) => {
            return items
                .filter((i) => i instanceof _1.GraphNode)
                .map(i => Array.from(i.incoming)).flat()
                .filter(e => key.includes(e.value))
                .map(e => e.source);
        };
        return this._createNewQuery(func);
    }
    filter(filterFunc) {
        const func = (items) => {
            return items.filter(filterFunc);
        };
        return this._createNewQuery(func);
    }
    canTraverse(query) {
        const func = (items) => {
            return items.filter(i => query.execute([i]).length > 0);
        };
        return this._createNewQuery(func);
    }
}
exports.Query = Query;
exports.query = new Query();
//# sourceMappingURL=query.js.map