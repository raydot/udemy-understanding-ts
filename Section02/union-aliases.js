"use strict";
// Can work with multiple values with union types!
function combine(
//input1: number | string,
// Use the custom type alias
input1, input2, 
//resultConversion: "as-number" | "as-text" // literal type!
resultConversion) {
    var result;
    if ((typeof input1 === "number" && typeof input2 === "number") ||
        resultConversion === "as-number") {
        result = +input1 + +input2;
    }
    else {
        result = input1.toString() + input2.toString();
    }
    return result;
    // if (resultConversion === "as-number") { // force conversion
    //   return +result;
    // } else {
    //   return result.toString();
    // }
}
var combinedAges = combine(30, 26, "as-number");
console.log(combinedAges);
var combinedStringAges = combine("30", "26", "as-number");
console.log(combinedStringAges);
var combinedNames = combine("Max", "Anna", "as-text"); // This wont work, not a number!
console.log(combinedNames);
