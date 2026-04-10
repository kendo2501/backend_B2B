"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
class Money {
    value;
    constructor(value) {
        this.value = value;
    }
    static zero() { return new Money(new decimal_js_1.default(0)); }
    static from(input) { return new Money(new decimal_js_1.default(input)); }
    add(other) { return new Money(this.value.add(other.value)); }
    sub(other) {
        const next = this.value.sub(other.value);
        if (next.isNegative())
            throw new Error("Money cannot be negative");
        return new Money(next);
    }
    mul(input) { return new Money(this.value.mul(input)); }
    toString() { return this.value.toFixed(2); }
    toNumber() { return this.value.toNumber(); }
}
exports.Money = Money;
