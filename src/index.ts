import GraphNodeArray from "./GraphNodeArray"
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
    deleted: boolean = false

    constructor(source: GraphNode, value: string, destination: GraphNode) {
        this._source = source
        this._destination = destination

        this.value = value

        source.outgoing.add(this)
        destination.incoming.add(this)
    }

    get source() {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }

        return this._source
    }
    set source(value: GraphNode) {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }

        this._source.outgoing.delete(this)
        this._source = value
        this._source.outgoing.add(this)
    }
    get destination() {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }

        return this._destination
    }
    set destination(value: GraphNode) {
        if (this.deleted) {
            throw new Error("This edge has been deleted! No properties are available.");
        }

        this._destination.incoming.delete(this)
        this._destination = value
        this._destination.incoming.add(this)
    }

    delete() {
        if (this.deleted) {
            throw new Error("This edge has already been deleted!");
        }

        this._source.outgoing.delete(this)
        this._destination.incoming.delete(this)
        this.deleted = true
    }
}

type EdgeProperties = { name?: string, array?: false, mode?: 'incoming' | 'outgoing' } | { name?: string, array: true, mode?: 'outgoing' }
export const edge: (arg?: EdgeProperties | string) => ((target: GraphNode, propertyKey: string) => void) = Descriptor(
    // @ts-ignore
    <T extends GraphNode>(target: GraphNode,
        propertyKey: string,
        [edgeProperties]: [EdgeProperties] | [string] | []): {
            getter: (this: GraphNode) => T | undefined,
            setter: (this: GraphNode, value: T | null | undefined) => void
        } |
        {
            getter: (this: GraphNode) => GraphNodeArray<T>,
            setter: (this: GraphNode, value: T[] | GraphNodeArray<T>) => void
        } => {


        let edgeValue: string = propertyKey
        let mode: 'incoming' | 'outgoing' = 'outgoing'
        let isArray = false

        if (edgeProperties) {
            if (typeof edgeProperties === 'object') {
                if (edgeProperties.name) {
                    edgeValue = edgeProperties.name
                }
                if (edgeProperties.array !== undefined) {
                    isArray = edgeProperties.array
                }
                if (edgeProperties.mode !== undefined) {
                    mode = edgeProperties.mode
                }
            }
            if (typeof edgeProperties === 'string') {
                edgeValue = edgeProperties
            }
        }

        const outgoing = mode === 'outgoing'

        const getNodeOutput = (node: GraphNode) => outgoing ? node.outgoing : node.incoming
        const getEdgeOutput = (edge: GraphEdge) => outgoing ? edge.destination : edge.source
        const setEdgeOutput = (edge: GraphEdge, value: GraphNode) => outgoing ? edge.destination = value : edge.source = value


        if (!isArray) {
            const getter = function (this: GraphNode): T | undefined {
                for (const edge of getNodeOutput(this)) {
                    if (edge.value === edgeValue) {
                        return getEdgeOutput(edge) as T
                    }
                }
                return undefined
            }

            const setter = function (this: GraphNode, newVal: T | null | undefined) {
                const deleteEdge = newVal === null || newVal === undefined

                // type guard
                if (!(newVal instanceof GraphNode) && deleteEdge === false) {
                    throw new Error("This property only accepts a GraphNode instance. If you want to delete this connection, set this property to null or undefined");
                }

                // find edge
                let foundEdge: GraphEdge | undefined
                for (const edge of getNodeOutput(this)) {
                    if (edge.value === edgeValue) {
                        foundEdge = edge
                        break
                    }
                }

                if (deleteEdge) {
                    if (foundEdge) {
                        foundEdge.delete()
                    }
                }
                else {
                    if (foundEdge) {
                        setEdgeOutput(foundEdge, newVal)
                    }
                    else {
                        if (outgoing)
                            new GraphEdge(this, edgeValue, newVal)
                        else
                            new GraphEdge(newVal, edgeValue, this)
                    }
                }
            }
            return { getter, setter }
        }


        const arrayGetter = function (this: GraphNode): GraphNodeArray<T> {
            return new GraphNodeArray<T>(this, edgeValue)
        }

        const arraySetter = function (this: GraphNode, newValues: T[] | GraphNodeArray<T>) {
            // get all nodes
            if (newValues instanceof GraphNodeArray) {
                newValues = newValues.asArray()
            }

            // delete all edges
            Array.from(this.outgoing)
                .filter(edge => edge.value === edgeValue)
                .forEach(edge => edge.delete())

            // add new edges
            newValues.forEach(node => {
                new GraphEdge(this, edgeValue, node)
            })
        }

        return { getter: arrayGetter, setter: arraySetter }
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

