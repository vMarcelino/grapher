import { GraphEdge, GraphNode } from ".";
type GraphObject = GraphNode | GraphEdge
type ExecutionFunction = (items: GraphObject[]) => GraphObject[]

export class Query {
    executionPath: Array<ExecutionFunction>

    constructor(executionPath?: Array<ExecutionFunction>) {
        if (executionPath)
            this.executionPath = executionPath
        else
            this.executionPath = []
    }

    execute(items: GraphObject[]) {
        for (const func of this.executionPath) {
            items = func(items)
        }
        return items
    }

    private _createNewQuery(func: ExecutionFunction) {
        return new Query([...this.executionPath, func])
    }

    throughOutgoingEdge(key: string | string[]) {
        if (!Array.isArray(key))
            key = [key]

        const func: ExecutionFunction = (items) => {
            return items
                .filter((i): i is GraphNode => i instanceof GraphNode)
                .map(i => Array.from(i.outgoing)).flat()
                .filter(e => key.includes(e.value))
                .map(e => e.destination)
        }
        return this._createNewQuery(func)
    }

    throughIncomingEdge(key: string | string[]) {
        if (!Array.isArray(key))
            key = [key]

        const func: ExecutionFunction = (items) => {
            return items
                .filter((i): i is GraphNode => i instanceof GraphNode)
                .map(i => Array.from(i.incoming)).flat()
                .filter(e => key.includes(e.value))
                .map(e => e.source)
        }
        return this._createNewQuery(func)
    }

    filter(filterFunc: (graphObject: GraphObject) => boolean) {
        const func: ExecutionFunction = (items) => {
            return items.filter(filterFunc)
        }
        return this._createNewQuery(func)
    }

    canTraverse(query: Query) {
        const func: ExecutionFunction = (items) => {
            return items.filter(i => query.execute([i]).length > 0)
        }
        return this._createNewQuery(func)
    }
}
export const query = new Query()