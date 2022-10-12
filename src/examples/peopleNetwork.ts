import { edge, GraphNode, incomingEdgeView } from "..";
import GraphNodeArray from "../GraphNodeArray";
import { query } from "../query";

class Person extends GraphNode {
    static people: Person[] = []
    constructor(public name: string) {
        super()
        Person.people.push(this)
    }

    @edge({ array: true })
    knows!: GraphNodeArray<Person>

    @edge({ array: true })
    likes!: GraphNodeArray<Person>

    @incomingEdgeView('likes')
    likesMe!: Person[]
}

function knowEachOther(a: Person, b: Person) {
    a.knows.add(b)
    b.knows.add(a)
}

const albert = new Person('Albert')
const bernard = new Person('Bernard')
const charlie = new Person('Charlie')
const daisy = new Person('Daisy')
const elron = new Person('Elron')
const falco = new Person('Falco')


knowEachOther(albert, bernard)
knowEachOther(albert, charlie)
knowEachOther(charlie, daisy)
knowEachOther(daisy, elron)
knowEachOther(elron, falco)
knowEachOther(falco, daisy)

albert.likes.add(daisy)
bernard.likes.add(charlie)
charlie.likes.add(bernard)
falco.likes.add(daisy)


// who likes someone that likem them?
console.log(Person.people.filter(person =>
    query
        .throughOutgoingEdge('likes')
        .throughOutgoingEdge('likes')
        .filter(personToCheck => personToCheck === person)
        .execute([person]).length !== 0
).map(person => person.name))