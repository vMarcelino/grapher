import { Query } from "./query";
export declare class GraphNode {
    incoming: Set<GraphEdge>;
    outgoing: Set<GraphEdge>;
    constructor();
}
export declare class GraphEdge {
    value: string;
    _source: GraphNode;
    _destination: GraphNode;
    deleted: boolean;
    constructor(source: GraphNode, value: string, destination: GraphNode);
    get source(): GraphNode;
    set source(value: GraphNode);
    get destination(): GraphNode;
    set destination(value: GraphNode);
    delete(): void;
}
declare type EdgeProperties = {
    name?: string;
    array?: false;
    mode?: 'incoming' | 'outgoing';
} | {
    name?: string;
    array: true;
    mode?: 'outgoing';
};
export declare const edge: (arg?: EdgeProperties | string) => ((target: GraphNode, propertyKey: string) => void);
export declare const incomingEdgeView: (args_0: string) => (target: GraphNode, propertyKey: string) => void;
export declare const queryEdgeView: (args_0: Query) => (target: GraphNode, propertyKey: string) => void;
export {};
