import TestClass from './TestClass.js';
import MySolution from './MySolution.js';
import config from './config.json' assert { type: 'json' };

let executedTests = 0;
let successfulTests = 0;
let executedMethods = 0;
let successfulMethods = 0;


function setup() {
    let missingMethods = findSameMethods().missingMethods;

    const testCases = config.testcases;

    for (const testCaseName in testCases) {
        console.log(`Running test case: ${testCaseName}`);
        const testCase = testCases[testCaseName];
        let constructorValues = generateParameters(testCase.constructor);
        const testClassInstance = new TestClass(...constructorValues);
        const mySolutionInstance = new MySolution(...constructorValues);

        if (testClassInstance === undefined || mySolutionInstance === undefined) {
            console.error('Error creating instances of classes');
            return;
        }

        console.log('Running constructor values: ', constructorValues);

        for (const method of testCase.methods) {
            runMethod(testClassInstance, mySolutionInstance, method, missingMethods);
        }

        executedTests++;
        if (executedMethods === successfulMethods) {
            successfulTests++;
        }
        console.log(`Executed methods: ${executedMethods}, successful methods: ${successfulMethods}, Percentage: ${percentage(successfulMethods, executedMethods)}%\n`);
        executedMethods = 0;
        successfulMethods = 0;
    }

    console.log(`\nExecuted tests: ${executedTests}, successful tests: ${successfulTests}, Percentage: ${percentage(successfulTests, executedTests)}%`);
    console.log(`Missing methods: ${missingMethods}\n`);
}

function runMethod(testClassInstance, mySolutionInstance, method, missingMethods) {
    executedMethods++;
    const methodName = method.method;
    const methods = findSameMethods();
    const allMethods = methods.methods;
    if (!allMethods.includes(methodName)) {
        if (TestClass.prototype[methodName] === undefined) {
            console.error(`Method '${methodName}' does not exist in TestClass`);
            if (!missingMethods.includes(methodName)) {
              missingMethods.push(methodName);
            }
        }
        return;
    }
    const generatedParams = generateParameters(method.parameters);
    const testClassResult = testClassInstance[methodName](...generatedParams || []);
    const mySolutionResult = mySolutionInstance[methodName](...generatedParams || []);
    if (testClassResult === mySolutionResult) {
        console.log(`Method '${methodName}' with values `, generatedParams, ` passed returned ${mySolutionResult}`);
        successfulMethods++;
    } else {
        console.error(`Method '${methodName}' with values `, generatedParams, ` failed expected ${mySolutionResult} but got ${testClassResult}`);
    }
}

function generateParameters(parameters) {
    if (parameters === undefined) {
        return [];
    }
    const random = Math.random();
    let args = new Array(parameters.length);
    for (let i = 0; i < parameters.length; i++) {
        if (parameters[i].charAt(0) === 'i') {
            args[i] = getIntValue(parameters[i].substring(1));
        } else if (parameters[i].charAt(0) === 's') {
            args[i] = parameters[i].substring(1);
        } else if (parameters[i].charAt(0) === 'c') {
            args[i] = parameters[i].charAt(1);
        } else {
            args[i] = config[parameters[i].substring(1)][Math.floor(Math.random() * config[parameters[i].substring(1)].length)];
        }
    }
    return args;
}

function getIntValue(value) {
    const t = value.charAt(0);
    const maxNumericValue = parseInt(value.substring(1).split(',')[0]);
    let val = 0;
    switch (t) {
        case 'P':
            val = 1 + Math.random() * maxNumericValue;
            break;
        case 'N':
            val = -Math.random() * maxNumericValue;
            break;
        case 'Z':
            val = 0;
            break;
        case 'R':
            val = -maxNumericValue + Math.random() * (2 * maxNumericValue + 1);
            break;
        case 'X':
            val = parseFloat(value.substring(1).split(',')[0]);
            break;
        case 'I':
            const interv = value.substring(1).split(',');
            val = parseFloat(interv[0]) + Math.floor(Math.random() * (parseFloat(interv[1]) - parseFloat(interv[0]) + 1));
            break;
    }
    return Math.floor(val);
}

function findSameMethods() {
  let methods = [];
  let missingMethods = [];

  let mySolutionMethods = Object.getOwnPropertyNames(MySolution.prototype);
  for (let i = 0; i < mySolutionMethods.length; i++) {
      if (TestClass.prototype[mySolutionMethods[i]] === undefined) {
          continue;
      }
      if (areMethodSignatureEqual(TestClass.prototype[mySolutionMethods[i]], MySolution.prototype[mySolutionMethods[i]])) {
          methods.push(mySolutionMethods[i]);
      } else {
          missingMethods.push(mySolutionMethods[i]);
      }
  }
  
  return { methods, missingMethods };
}


function areMethodSignatureEqual(testClassMethod, mySolutionMethod) {
    return testClassMethod.length === mySolutionMethod.length;
}

function percentage(part, whole) {
    return Math.round(100 * part / whole, 2);
}

setup();
