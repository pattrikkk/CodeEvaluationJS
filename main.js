import TestClass from './TestClass.js';
import MySolution from './MySolution.js';
import config from './config.json' assert { type: 'json' };

function setup() {
  const testCases = config.testcases;

  console.log(findSameMethods());

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
      runMethod(testClassInstance, mySolutionInstance, method);
    }

  }
}

function runMethod(testClassInstance, mySolutionInstance, method) {
  const methodName = method.method;
  const allMethods = findSameMethods();
  if (!allMethods.includes(methodName)) {
    console.error(`Method '${methodName}' does not exist in both classes`);
    return;
  }
  const generatedParams = generateParameters(method.parameters);
  const testClassResult = testClassInstance[methodName](...generatedParams || []);
  const mySolutionResult = mySolutionInstance[methodName](...generatedParams || []);
  if (testClassResult === mySolutionResult) {
    console.log(`Method '${methodName}' with values `, generatedParams, ` passed returned ${mySolutionResult}`);
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
      args[i] = config[parameters[i].substring(1)][random.nextInt(config[parameters[i].substring(1)].length)];
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
  let mySolutionMethods = Object.getOwnPropertyNames(MySolution.prototype);
  for (let i = 0; i < mySolutionMethods.length; i++) {
    if (TestClass.prototype[mySolutionMethods[i]] === undefined) {
      continue;
    }
    if (areMethodSignatureEqual(TestClass.prototype[mySolutionMethods[i]], MySolution.prototype[mySolutionMethods[i]])) {
      methods.push(mySolutionMethods[i]);
    }
  }
  return methods;
}

function areMethodSignatureEqual(testClassMethod, mySolutionMethod) {
  return testClassMethod.length === mySolutionMethod.length;
}

setup();

