class MySolution {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    sum(a, b) {
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

export default MySolution;
