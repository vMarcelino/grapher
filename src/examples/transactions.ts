import { edge, GraphNode, incomingEdgeView } from "..";
import GraphNodeArray from "../GraphNodeArray";
import { query } from "../query";

class Person extends GraphNode {
    static all: Person[] = []
    constructor(public name: string) {
        super()
        Person.all.push(this)
    }

    @edge({ array: true, name: 'paid' })
    expenses!: GraphNodeArray<Transaction>

    @incomingEdgeView('received')
    incomes!: Transaction[]

    payed(other: Person, value: number, date: Date, tags: string[]) {
        new Transaction(this, other, value, date, tags)
    }
}

class Transaction extends GraphNode {
    static all: Transaction[] = []
    constructor(payer: Person, payee: Person, public value: number, public date: Date, tags: string[]) {
        super()
        this.payee = payee
        this.payer = payer
        tags.map(tag => Tag.new(tag)).forEach(tag => this.tags.add(tag))

        Transaction.all.push(this)
    }

    @edge('received')
    payee!: Person

    @edge({ name: 'paid', mode: 'incoming' })
    payer!: Person

    @edge({ array: true, name: 'tag' })
    tags!: GraphNodeArray<Tag>
}

class Tag extends GraphNode {
    static all: Record<string, Tag> = {}
    private constructor(public name: string) {
        super()
        Tag.all[name] = this
    }
    static new(name: string) {
        if (name in Tag.all)
            return Tag.all[name]

        return new Tag(name)
    }

    @incomingEdgeView('tag')
    transactions!: Transaction[]
}

const albert = new Person('Albert')
const bernard = new Person('Bernard')
const charlie = new Person('Charlie')
const daisy = new Person('Daisy')
const elron = new Person('Elron')
const falco = new Person('Falco')

albert.payed(bernard, 150, new Date(), ['party', 'vacation'])
charlie.payed(bernard, 120, new Date(), ['party', 'vacation'])
daisy.payed(bernard, 130, new Date(), ['party', 'vacation', 'bonus'])
bernard.payed(elron, 400, new Date(), ['reimbursement', 'party', 'travel expenses'])
falco.payed(daisy, 1000, new Date(), ['bonus'])

console.log('All transactions tagget "party":\n' +
    Tag.new('party').transactions
        .map(t => `${t.payee.name} ===[${t.value.toFixed(2)}]===> ${t.payer.name}`)
        .join('\n')
)

console.log('Everyone that payed who albert payed:',
    query
        .throughOutgoingEdge('paid').throughOutgoingEdge('received')
        .throughIncomingEdge('received').throughIncomingEdge('paid')
        .execute([albert])
        .map(p => (p as Person).name)
)