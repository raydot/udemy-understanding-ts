"use strict";
function add(n1, n2) {
    // inferred return type!
    // return n1.toString() + n2; // breaks because not returning right type
    return n1 + n2;
}
function printResult(num) {
    // void return type!
    console.log("Result: " + num);
}
function undefinedReturnValueFunction(num) {
    // must return undefined, will not work if it returns nothing
    return;
}
function addAndHandle(n1, n2, cb) {
    var result = n1 + n2;
    cb(result);
}
console.log(printResult(add(5, 12)));
// let someValue: undefined; // useless, but exists!
// let combineValues; // but this is any type
// let combineValues: Function; // any function!
//Function types to the rescue!
var combineValues; // takes no values and returns number
combineValues = add;
// combineValues = 5; // this should not be allowed!
// Now that we've added return types, this won't work!
// combineValues = printResult; // But this is not the function I want!
console.log(combineValues(8, 8));
addAndHandle(10, 20, function (result) {
    // don't need a type because of the way it's been defined in addAndHandle
    console.log(result);
    return result; // even though addAndHandle returns void, this will be ignored *because* type is void
});
