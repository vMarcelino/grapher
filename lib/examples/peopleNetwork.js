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
        Person.people.push(this);
    }
    static { this.people = []; }
}
__decorate([
    (0, __1.edge)({ array: true })
], Person.prototype, "knows", void 0);
__decorate([
    (0, __1.edge)({ array: true })
], Person.prototype, "likes", void 0);
__decorate([
    (0, __1.incomingEdgeView)('likes')
], Person.prototype, "likesMe", void 0);
function knowEachOther(a, b) {
    a.knows.add(b);
    b.knows.add(a);
}
const albert = new Person('Albert');
const bernard = new Person('Bernard');
const charlie = new Person('Charlie');
const daisy = new Person('Daisy');
const elron = new Person('Elron');
const falco = new Person('Falco');
knowEachOther(albert, bernard);
knowEachOther(albert, charlie);
knowEachOther(charlie, daisy);
knowEachOther(daisy, elron);
knowEachOther(elron, falco);
knowEachOther(falco, daisy);
albert.likes.add(daisy);
bernard.likes.add(charlie);
charlie.likes.add(bernard);
falco.likes.add(daisy);
// who likes someone that likem them?
console.log(Person.people.filter(person => query_1.query
    .throughOutgoingEdge('likes')
    .throughOutgoingEdge('likes')
    .filter(personToCheck => personToCheck === person)
    .execute([person]).length !== 0).map(person => person.name));
//# sourceMappingURL=peopleNetwork.js.map