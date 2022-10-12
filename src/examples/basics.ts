import { GraphNode, edge, incomingEdgeView, queryEdgeView } from ".."
import { query } from "../query"

class Obj1<T> extends GraphNode {
    value: T
    constructor(value: T) {
        super()
        this.value = value
        console.log('Obj created:', { value })
    }

    @edge()
    child1: Obj1<T> | undefined

    @edge('child 2 with a different edge name')
    child2: Obj1<T> | undefined

    @incomingEdgeView('child1')
    _prop1!: Obj1<T>[]

    @queryEdgeView(query.throughOutgoingEdge('child1').throughOutgoingEdge('child1'))
    _doubleProp1!: Obj1<T>[]

    @queryEdgeView(query.throughOutgoingEdge('child1').throughIncomingEdge('child1'))
    _parentsOfChild1!: Obj1<T>[]
}

const g = new Obj1('G')
const a = new Obj1('A')
const b = new Obj1('B')
const c = new Obj1('C')


g.child1 = a
g.child2 = b

print(g)
print(a)
print(b)
print(c)
g.child1 = c
c.child1 = a
a.child1 = b
b.child1 = c
print(g)
print(a)
print(b)
print(c)

function print(o: Obj1<any>) {
    console.log(`${o.value}(prop1: ${o.child1?.value}, prop2: ${o.child2?.value}, _prop1: ${o._prop1.length}, parentsOfChild1: ${o._parentsOfChild1.length})`)
}