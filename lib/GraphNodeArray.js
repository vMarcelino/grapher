"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class GraphNodeArray {
    constructor(source, key) {
        this.source = source;
        this.key = key;
    }
    add(node) {
        new _1.GraphEdge(this.source, this.key, node);
    }
    delete(node) {
        for (const edge of this.source.outgoing) {
            if (edge.value === this.key && edge.destination === node) {
                edge.delete();
                return true;
            }
        }
        return false;
    }
    asArray() {
        return Array.from(this.source.outgoing)
            .filter(edge => edge.value === this.key)
            .map(edge => edge.destination);
    }
}
exports.default = GraphNodeArray;
//# sourceMappingURL=GraphNodeArray.js.map