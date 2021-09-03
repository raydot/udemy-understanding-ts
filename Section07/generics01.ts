// Generics

// Default type
// Two types being combined, array and string

// This by itself returns "interface Array<T>"
// because you don't provide a type
const names: Array = [];

const names2: any = []; // better than nothing

const names3: Array<string> = []; // perfection!

const names4: Array<string | number> = [];

// names3[0].split[0] // works beause we know it's a strong

// Promise is a generic type too.  Here is the unknown type
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("This is done");
  }, 2000);
});
// Does this because of type safety
promise.then((data) => {
  data.split(""); // can't do this, don't know type!
});

// This must be a string!
const promise2 = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve("This is done");
  }, 2000);
});
