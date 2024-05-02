class TestClass {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    sum(a, b, c) {
        return a + b;
    }

    value() {
        return this.a;
    }

    test(a, b) {
        return a + b;
    }

    reverseString(str) {
        return str.split('').reverse().join('');
    }
}

export default TestClass;
