"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryEdgeView = exports.incomingEdgeView = exports.edge = exports.GraphEdge = exports.GraphNode = void 0;
const GraphNodeArray_1 = require("./GraphNodeArray");
const descriptor_1 = require("./utils/descriptor");
class GraphNode {
    constructor() {
        this.incoming = new Set();
        this.outgoing = new Set();
    }
}
exports.GraphNode = GraphNode;
class GraphEdge {
    constructor(source, value, destination) {
        this.deleted = false;
        this._source = source;
        this._destination = destination;
        this.value = value;
        source.outgoing.add(this);
        destination.incoming.add(this);
    }
    get source() {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }
        return this._source;
    }
    set source(value) {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }
        this._source.outgoing.delete(this);
        this._source = value;
        this._source.outgoing.add(this);
    }
    get destination() {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }
        return this._destination;
    }
    set destination(value) {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }
        this._destination.incoming.delete(this);
        this._destination = value;
        this._destination.incoming.add(this);
    }
    delete() {
        if (this.deleted) {
            throw new Error("This edge has already been deleted!");
        }
        this._source.outgoing.delete(this);
        this._destination.incoming.delete(this);
        this.deleted = true;
    }
}
exports.GraphEdge = GraphEdge;
exports.edge = (0, descriptor_1.default)(
// @ts-ignore
(target, propertyKey, [edgeProperties]) => {
    let edgeValue = propertyKey;
    let mode = 'outgoing';
    let isArray = false;
    if (edgeProperties) {
        if (typeof edgeProperties === 'object') {
            if (edgeProperties.name) {
                edgeValue = edgeProperties.name;
            }
            if (edgeProperties.array !== undefined) {
                isArray = edgeProperties.array;
            }
            if (edgeProperties.mode !== undefined) {
                mode = edgeProperties.mode;
            }
        }
        if (typeof edgeProperties === 'string') {
            edgeValue = edgeProperties;
        }
    }
    const outgoing = mode === 'outgoing';
    const getNodeOutput = (node) => outgoing ? node.outgoing : node.incoming;
    const getEdgeOutput = (edge) => outgoing ? edge.destination : edge.source;
    const setEdgeOutput = (edge, value) => outgoing ? edge.destination = value : edge.source = value;
    if (!isArray) {
        const getter = function () {
            for (const edge of getNodeOutput(this)) {
                if (edge.value === edgeValue) {
                    return getEdgeOutput(edge);
                }
            }
            return undefined;
        };
        const setter = function (newVal) {
            const deleteEdge = newVal === null || newVal === undefined;
            // type guard
            if (!(newVal instanceof GraphNode) && deleteEdge === false) {
                throw new Error("This property only accepts a GraphNode instance. If you want to delete this connection, set this property to null or undefined");
            }
            // find edge
            let foundEdge;
            for (const edge of getNodeOutput(this)) {
                if (edge.value === edgeValue) {
                    foundEdge = edge;
                    break;
                }
            }
            if (deleteEdge) {
                if (foundEdge) {
                    foundEdge.delete();
                }
            }
            else {
                if (foundEdge) {
                    setEdgeOutput(foundEdge, newVal);
                }
                else {
                    if (outgoing)
                        new GraphEdge(this, edgeValue, newVal);
                    else
                        new GraphEdge(newVal, edgeValue, this);
                }
            }
        };
        return { getter, setter };
    }
    const arrayGetter = function () {
        return new GraphNodeArray_1.default(this, edgeValue);
    };
    const arraySetter = function (newValues) {
        // get all nodes
        if (newValues instanceof GraphNodeArray_1.default) {
            newValues = newValues.asArray();
        }
        // delete all edges
        Array.from(this.outgoing)
            .filter(edge => edge.value === edgeValue)
            .forEach(edge => edge.delete());
        // add new edges
        newValues.forEach(node => {
            new GraphEdge(this, edgeValue, node);
        });
    };
    return { getter: arrayGetter, setter: arraySetter };
});
exports.incomingEdgeView = (0, descriptor_1.default)((target, propertyKey, [key]) => {
    const getter = function () {
        const result = [];
        this.incoming.forEach(edge => {
            if (edge.value === key)
                result.push(edge.source);
        });
        return result;
    };
    const setter = undefined;
    return { getter, setter };
});
exports.queryEdgeView = (0, descriptor_1.default)((target, propertyKey, [query]) => {
    const getter = function () {
        return query.execute([this]);
    };
    const setter = undefined;
    return { getter, setter };
});
//# sourceMappingURL=index.js.map