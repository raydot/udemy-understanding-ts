// type alias
type Combinable = number | string;
type ConversionDescriptor = "as-number" | "as-text";

// Can work with multiple values with union types!
function combine(
  //input1: number | string,
  // Use the custom type alias
  input1: Combinable,
  input2: number | string,
  //resultConversion: "as-number" | "as-text" // literal type!
  resultConversion: ConversionDescriptor
) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;

  // if (resultConversion === "as-number") { // force conversion
  //   return +result;
  // } else {
  //   return result.toString();
  // }
}

const combinedAges = combine(30, 26, "as-number");
console.log(combinedAges);

const combinedStringAges = combine("30", "26", "as-number");
console.log(combinedStringAges);

const combinedNames = combine("Max", "Anna", "as-text"); // This wont work, not a number!
console.log(combinedNames);
