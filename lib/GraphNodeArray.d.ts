import { GraphNode } from ".";
export default class GraphNodeArray<T extends GraphNode> {
    private source;
    private key;
    constructor(source: GraphNode, key: string);
    add(node: T): void;
    delete(node: T): boolean;
    asArray(): T[];
}
