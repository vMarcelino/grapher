import { Query } from "./query"
import Descriptor from "./utils/descriptor"

export class GraphNode {
    incoming = new Set<GraphEdge>()
    outgoing = new Set<GraphEdge>()
    constructor() {
    }
}
export class GraphEdge {
    value: string
    _source: GraphNode
    _destination: GraphNode

    constructor(source: GraphNode, value: string, destination: GraphNode) {
        this._source = source
        this._destination = destination

        this.value = value

        source.outgoing.add(this)
        destination.incoming.add(this)
    }

    get source() {
        return this._source
    }
    set source(value: GraphNode) {
        this._source.outgoing.delete(this)
        this._source = value
        this._source.outgoing.add(this)
    }
    get destination() {
        return this._destination
    }
    set destination(value: GraphNode) {
        this._destination.incoming.delete(this)
        this._destination = value
        this._destination.incoming.add(this)
    }
}

export const edge = Descriptor(<T extends GraphNode>(target: GraphNode, propertyKey: string) => {
    let value: T;

    const getter = function (this: GraphNode) {
        for (const edge of this.outgoing) {
            if (edge.value === propertyKey) {
                return edge.destination
            }
        }
        return undefined
    }

    const setter = function (this: GraphNode, newVal: T) {
        for (const edge of this.outgoing) {
            if (edge.value === propertyKey) {
                edge.destination = newVal
                return
            }
        }
        const edge = new GraphEdge(this, propertyKey, newVal)
    }
    return { getter, setter }
})

export const incomingEdgeView = Descriptor((target: GraphNode, propertyKey: string, [key]: [string]) => {
    const getter = function (this: GraphNode) {
        const result: GraphNode[] = []
        this.incoming.forEach(edge => {
            if (edge.value === key)
                result.push(edge.source)
        })
        return result
    }
    const setter = undefined
    return { getter, setter }
})

export const queryEdgeView = Descriptor((target: GraphNode, propertyKey: string, [query]: [Query]) => {
    const getter = function (this: GraphNode) {
        return query.execute([this])
    }
    const setter = undefined
    return { getter, setter }
})

