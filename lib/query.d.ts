import { GraphEdge, GraphNode } from ".";
declare type GraphObject = GraphNode | GraphEdge;
declare type ExecutionFunction = (items: GraphObject[]) => GraphObject[];
export declare class Query {
    executionPath: Array<ExecutionFunction>;
    constructor(executionPath?: Array<ExecutionFunction>);
    execute(items: GraphObject[]): GraphObject[];
    private _createNewQuery;
    throughOutgoingEdge(key: string | string[]): Query;
    throughIncomingEdge(key: string | string[]): Query;
    filter(filterFunc: (graphObject: GraphObject) => boolean): Query;
    canTraverse(query: Query): Query;
}
export declare const query: Query;
export {};
