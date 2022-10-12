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
class Obj1 extends __1.GraphNode {
    constructor(value) {
        super();
        this.value = value;
        console.log('Obj created:', { value });
    }
}
__decorate([
    (0, __1.edge)()
], Obj1.prototype, "child1", void 0);
__decorate([
    (0, __1.edge)('child 2 with a different edge name')
], Obj1.prototype, "child2", void 0);
__decorate([
    (0, __1.incomingEdgeView)('child1')
], Obj1.prototype, "_prop1", void 0);
__decorate([
    (0, __1.queryEdgeView)(query_1.query.throughOutgoingEdge('child1').throughOutgoingEdge('child1'))
], Obj1.prototype, "_doubleProp1", void 0);
__decorate([
    (0, __1.queryEdgeView)(query_1.query.throughOutgoingEdge('child1').throughIncomingEdge('child1'))
], Obj1.prototype, "_parentsOfChild1", void 0);
const g = new Obj1('G');
const a = new Obj1('A');
const b = new Obj1('B');
const c = new Obj1('C');
g.child1 = a;
g.child2 = b;
print(g);
print(a);
print(b);
print(c);
g.child1 = c;
c.child1 = a;
a.child1 = b;
b.child1 = c;
print(g);
print(a);
print(b);
print(c);
function print(o) {
    console.log(`${o.value}(prop1: ${o.child1?.value}, prop2: ${o.child2?.value}, _prop1: ${o._prop1.length}, parentsOfChild1: ${o._parentsOfChild1.length})`);
}
//# sourceMappingURL=basics.js.map