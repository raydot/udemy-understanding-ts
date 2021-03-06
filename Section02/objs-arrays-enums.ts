// const person: {
//   // you can be explicit, but probably better to let TS infer
//   name: string;
//   age: number;
// }
// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string]; // look maw, I defined a tuple!
// } = {
//   name: "Luigi",
//   age: 117,
//   hobbies: ["sports", "cooking"],
//   role: [2, "author"], // tuple!
// };
// const ADMIN = 0; // WOULDN'T AN ENUM BE NICE?
// const READ_ONLY = 1;
// const AUTHOR = 2;

// Be sure and look at how JS rewrites the ENUM!

enum Role {
  ADMIN = 5, // set the starting value, assign your own values
  READ_ONLY,
  AUTHOR,
} // custom type

const person = {
  name: "Luigi",
  age: 117,
  hobbies: ["sports", "cooking"],
  role: Role.AUTHOR,
};

// person.role.push("admin"); // should this work?  We're missing a number!  It does, push is an exception!
// person.role[1] = 10; // no go now that the tuple has been defined!

// person.role = [0, 'admin', 'user'] // no dice!  Too many vars!

// let favoriteActivities: string[] = "sports"; // error, not passing an array of strings!
// let favoriteActivities2: string[] = ["sports", 2]; // error!  Number is not a string!
// let favoriteActivities: any[] // put in what you want!  But bad practice because TS can't check...
console.log(person.name);

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase()); // TS knows it a string!
  // console.log(hobby.map()) // bad!  not an array!
}

// if (person.role === ADMIN) {
//   console.log("is admin");
// }
if (person.role === Role.ADMIN) {
  console.log("is admin");
}
