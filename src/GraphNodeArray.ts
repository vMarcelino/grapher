import { GraphEdge, GraphNode } from ".";

export default class GraphNodeArray<T extends GraphNode> {
    constructor(private source: GraphNode, private key: string) {

    }

    add(node: T) {
        new GraphEdge(this.source, this.key, node)
    }

    delete(node: T) {
        for (const edge of this.source.outgoing) {
            if (edge.value === this.key && edge.destination === node) {
                edge.delete()
                return true
            }
        }
        return false
    }

    asArray(): T[] {
        return (Array.from(this.source.outgoing)
            .filter(edge => edge.value === this.key)
            .map(edge => edge.destination) as T[])
    }

}