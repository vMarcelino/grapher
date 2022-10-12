"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const query_1 = require("../query");
class Person extends __1.GraphNode {
    constructor(name) {
        super();
        this.name = name;
        Person.all.push(this);
    }
    static { this.all = []; }
    payed(other, value, date, tags) {
        new Transaction(this, other, value, date, tags);
    }
}
__decorate([
    (0, __1.edge)({ array: true, name: 'paid' })
], Person.prototype, "expenses", void 0);
__decorate([
    (0, __1.incomingEdgeView)('received')
], Person.prototype, "incomes", void 0);
class Transaction extends __1.GraphNode {
    constructor(payer, payee, value, date, tags) {
        super();
        this.value = value;
        this.date = date;
        this.payee = payee;
        this.payer = payer;
        tags.map(tag => Tag.new(tag)).forEach(tag => this.tags.add(tag));
        Transaction.all.push(this);
    }
    static { this.all = []; }
}
__decorate([
    (0, __1.edge)('received')
], Transaction.prototype, "payee", void 0);
__decorate([
    (0, __1.edge)({ name: 'paid', mode: 'incoming' })
], Transaction.prototype, "payer", void 0);
__decorate([
    (0, __1.edge)({ array: true, name: 'tag' })
], Transaction.prototype, "tags", void 0);
class Tag extends __1.GraphNode {
    constructor(name) {
        super();
        this.name = name;
        Tag.all[name] = this;
    }
    static { this.all = {}; }
    static new(name) {
        if (name in Tag.all)
            return Tag.all[name];
        return new Tag(name);
    }
}
__decorate([
    (0, __1.incomingEdgeView)('tag')
], Tag.prototype, "transactions", void 0);
const albert = new Person('Albert');
const bernard = new Person('Bernard');
const charlie = new Person('Charlie');
const daisy = new Person('Daisy');
const elron = new Person('Elron');
const falco = new Person('Falco');
albert.payed(bernard, 150, new Date(), ['party', 'vacation']);
charlie.payed(bernard, 120, new Date(), ['party', 'vacation']);
daisy.payed(bernard, 130, new Date(), ['party', 'vacation', 'bonus']);
bernard.payed(elron, 400, new Date(), ['reimbursement', 'party', 'travel expenses']);
falco.payed(daisy, 1000, new Date(), ['bonus']);
console.log('All transactions tagget "party":\n' +
    Tag.new('party').transactions
        .map(t => `${t.payee.name} ===[${t.value.toFixed(2)}]===> ${t.payer.name}`)
        .join('\n'));
console.log('Everyone that payed who albert payed:', query_1.query
    .throughOutgoingEdge('paid').throughOutgoingEdge('received')
    .throughIncomingEdge('received').throughIncomingEdge('paid')
    .execute([albert])
    .map(p => p.name));
//# sourceMappingURL=transactions.js.map