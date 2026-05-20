"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopologicalSorter = void 0;
const common_1 = require("@nestjs/common");
let TopologicalSorter = class TopologicalSorter {
    sort(nodes, edges) {
        const inDegree = new Map();
        const adjList = new Map();
        for (const node of nodes) {
            inDegree.set(node.id, 0);
            adjList.set(node.id, []);
        }
        for (const edge of edges) {
            const neighbors = adjList.get(edge.source);
            if (neighbors) {
                neighbors.push(edge.target);
                inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
            }
        }
        const queue = nodes.filter((node) => inDegree.get(node.id) === 0).map((node) => node.id);
        const sortedOrder = [];
        while (queue.length > 0) {
            const nodeId = queue.shift();
            if (!nodeId)
                continue;
            sortedOrder.push(nodeId);
            const neighbors = adjList.get(nodeId);
            if (neighbors) {
                for (const neighbor of neighbors) {
                    const currentInDegree = inDegree.get(neighbor) || 0;
                    inDegree.set(neighbor, currentInDegree - 1);
                    if (inDegree.get(neighbor) === 0) {
                        queue.push(neighbor);
                    }
                }
            }
        }
        if (sortedOrder.length !== nodes.length) {
            throw new Error('Cycle detected in the workflow graph.');
        }
        return sortedOrder;
    }
};
exports.TopologicalSorter = TopologicalSorter;
exports.TopologicalSorter = TopologicalSorter = __decorate([
    (0, common_1.Injectable)()
], TopologicalSorter);
//# sourceMappingURL=topological-sorter.js.map