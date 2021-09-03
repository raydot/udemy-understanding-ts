// Custom generics

// Merge two objects into a third
function merge(objA: object, objB: object) {
  return Object.assign(objA, objB);
}

console.log(merge({ name: "Lulu" }, { age: 422 }));

const mergedObject = merge({ name: "Lulu" }, { age: 422 });
console.log(mergedObject.age); // can't do this, info doesn't carry over

// could do this, but cumbersome
const mergedObject2 = merge({ name: "Bill" }, { weight: 199 }) as {
  name: string;
  age: number;
};

// Generics to the rescue
// viola, this returns the intersection of T&U!
// This just says "two different types, we don't know what"
// TS fills in the type for you.
function mergeGeneric<T, U>(objA: T, objB: U) {
  // can also do function mergeGeneric<T, U>(objA: T, objB:U) : T&U {} but not necessary
  return Object.assign(objA, objB);
}

const mergedObject3 = mergeGeneric({ name: "Bill" }, { weight: 199 });
// Works with different types, fills them in for T and U
const mergedObject4 = mergeGeneric(
  { name: ["Bill", "Millie"] },
  { school: "syracuse" }
);
// Can be specific, but then concrete values don't work
const mergedObject5 = mergeGeneric<string, number>(
  { name: ["Bill", "Millie"] }, // array, not string!
  { school: "syracuse" }
);
// Can also spell it all the say out, but that's redundant since TS will do this for you with generics.
const mergedObject6 = mergeGeneric<
  { name: string; hobbies: string[] },
  { age: number }
>({ name: "Tommy", hobbies: ["Sports", "Cooking"] }, { age: 45 });

// Working with constraints
// This fails silently, and just drops off the 30.
const mergedObject7 = mergeGeneric({ name: "Max", hobbies: ["Sports"] }, 30);
console.log(mergedObject7);

// Here, let's guarantee we ensure we get objects
function mergeGenericConstrained<T extends object, U extends object>(
  objA: T,
  objB: U
) {
  return Object.assign(objA, objB);
}

const mergedObject8 = mergeGenericConstrained(
  { name: "Max", hobbies: ["Sports"] },
  { age: 30 }
);
console.log(mergedObject8);

interface Lengthy {
  length: number;
}

// We cam extend Lengthy so TS knows to expect it
// Go generics go!
// Don't have to create a bunch of overloads
function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = "NO VALUE PASSED";
  if (element.length > 0) {
    descriptionText = "Got " + element.length + " elements";
  }
  return [element, descriptionText];
}

// Returns 9
console.log(countAndDescribe("Hi there!"));
// Returns 2
console.log(countAndDescribe(["Love", "Hate"]));
// Returns error message because function expects a string
console.log(countAndDescribe([]));
// Doesnt work!  Number doesn't have a length!
console.log(countAndDescribe(8080));

// keyof
function extractAndConvert(obj: object, key: string) {
  // But how do we know we get a key in the object?
  return "Value: " + obj[key];
}

// This won't really work, because no guarantee the key
// exists in the object
extractAndConvert({}, "name");

// Ah, but if we do this, using extends and extends keyof in a generic function:
function extractAndConvert2<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return "Value: " + obj[key];
}
// Et viola!
console.log(extractAndConvert2({ name: "Max" }, "name"));

// Generic classes
// Simple, generic class
class DataStorage<T extends string | number | boolean> {
  // no objects!
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  // Basic remove, but doesn't work with reference types, like objects!
  // removeItem(item: T) {
  //   this.data.splice(this.data.indexOf(item), 1);
  // }

  // Ok, but not entirely...
  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
// textStorage.addItem(20) // nope, need a string
textStorage.addItem("Bob");
textStorage.addItem("Lilly");
console.log(textStorage.getItems());
textStorage.removeItem("Lilly");
console.log(textStorage.getItems());

// Can do some funky stuff now!
const numberStorage = new DataStorage<number>();
const flexibleStorage = new DataStorage<number | string>();
const objStorage = new DataStorage<object>();
objStorage.addItem({ name: "Bobo" });
objStorage.addItem({ name: "Leo" });
objStorage.removeItem({ name: "Bobo" });
// Oops!  This doesn't work because objects are reference types!
console.log(objStorage.getItems());

// Generic types give flexibility combined with type safety!

// Bonus: Generic Utility Types
// Partial:
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

// So now that you have that interfae, you can do this, which is fine
function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  return { title: title, description: description, completeUntil: date };
}

// But what if you have to set it up more granularly
// for validation, extra steps, whatever.
function createCourseGoal2(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  // Set it up as a parital instead.
  // Partial = all types optional, temporarily
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  // return courseGoal // oops, not yet, it's still a partial!
  return courseGoal as CourseGoal; // bingo!
}

// READONLY type
// Works for arrays
// Also objects, where it prevents you from changing properties
// Not compiled to anything, but adds more checks
const namesro: Readonly<string[]> = ["Bobo", "Honey"];
namesro.push("Bobo"); //no sir, it's read only!
namesro.pop(); // also no!

// Full list of utility types: https://www.typescriptlang.org/docs/handbook/utility-types.html

// Generic types v. Union types
// DataStorageClass revisited
// Generic classes
// Simple, generic class
class DataStorageUnion {
  // Can't we just use a union instead of generics?
  // class DataStorage<T extends string | number | boolean>
  // means you can use string OR number OR boolean, but whatever
  // you choose, you have to stick with it.  We accept any of
  // these methods, as long as you're consistent...

  // This isn't saying "either", it's saying AND
  private data: (string | number | boolean)[] = [];

  // This isn't saying "either", it's saying XOR to the functions
  private data2: string[] | number[] | boolean[];

  addItem(item: string | number | boolean) {
    this.data.push(item);
  }

  removeItem(item: string | number | boolean) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

// TS Docs on generics:
// https://www.typescriptlang.org/docs/handbook/generics.html
