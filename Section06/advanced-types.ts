// Intersection types, allow us to combine other types

import { createNoSubstitutionTemplateLiteral } from "typescript";

type Admin = {
  // object type definition
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// Could have done it like this too:
// interface ElevatedEmployee extends Employee, Admin {}

// Intersection type
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privileges: ["create-server"],
  startDate: new Date(),
};

// Union types
type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

// overload add using TS!
//function add(n: number): number; // but then b must be optional...
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string; // etc...
function add(a: Combinable, b: Combinable) {
  // type guard, handles the types matching what's expected
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add(1, 5); // numbers
const result2 = add("bob", "jones"); // strings
//result.split(""); // not valid...unless you overload!

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  // if (typeof emp === 'Employee') // won't work, just returns 'object'
  // Do this instead:
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}

printEmployeeInformation(e1);

class Car {
  drive() {
    console.log("Driving");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck");
  }
  loadCargo(amount: number) {
    console.log("Loading cargo..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  // Type guards:
  // more of an approach than an actual thing

  // this won't work because loadCargo does not exist on type car
  // vehicle.loadCargo(1000)

  // if ("loadCargo" in vehicle) {
  //   // this works because TS can see you care
  //   vehicle.loadCargo(1000);
  // }

  // But this is even better:
  // instanceof is in vanilla JS
  // also prevents you mistyping the class name
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

// Discriminate Union Types
// Special type of type guard pattern
// Available with object types
interface Bird {
  type: "bird"; // literal type assignment
  flyingSpeed: number;
}

interface Horse {
  type: "horse"; // literal type
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  // But how to check animal speed?
  // if ('flyingSpeed' in animal) could get out of hand quickly
  // if there are a lot of animals!
  // Cant use instance of because there are interfaces, not classes.
  // Do this:
  // Notice TS picks up what is and isn't allowed really quickly!
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;
  }
  console.log("Moving with speed: " + speed);
}

moveAnimal({ type: "bird", flyingSpeed: 10 });

// Type casting:
// Tells TS that come value is of a specific type.
// Here TS correctly sees that this is a paragraph
//const paragraph = document.querySelector('p')

// But what about here?  All TS sees is an HTML element.
const paragraph = document.getElementById("message-output");

// Probably not the biggest deal for a <p>, but what if it's an input?
// First way to cast
// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!

// First way is cool, but might not work in JSX because of the angle brackets, so...
const userInputElement = document.getElementById(
  "user-input"
)! as HTMLInputElement;

// Exclamation mark means, remember, will never return null.  If you don't use this, there has to be a check.
// if (userInputElement) {
//  (userInputElement as HTMLInputElement).value = 'Hi there'
// } ...etc...

userInputElement.value = "Hello!";

// Index types = more flexible properties!
interface ErrorContainer {
  // Might want stuff like this, but we don't know in advance
  // {email: 'Not a valid email}, username: "Must start with character"}
  // In other words, I know the value type, but not how many or what names.
  id: string; // can add others but must be the same
  [prop: string]: string; // don't know name, don't know count, just know it's a string
}

const errorBag: ErrorContainer = {
  id: "12345",
  message: "Not a valid email!",
  username: "Must start with a capital letter",
  custom: "Can do as many of these as we want, as long as they're strings!",
};

// Optional chaining:
// Let's say you're pulling a lot of data from somewhere.
const fetchedUserData = {
  id: "u1",
  name: "Mike",
  // job: { title: "CEO", description: "My own company" },
};

// if there is no job (maybe not returned yet), this returns a runtime error
// console.log(fetchedUserData.job.title);

// This, however, does not, only <undefined>.  And that's regular JS
// console.log(fetchedUserData.job && fetchedUserData.job.title);

// Here is how in typescript:
console.log(fetchedUserData?.job?.title);

// Nullish coalescing
const userInput = null;

const storedData = userInput || "DEFAULT"; // works for null or undef, but you'll get hosed on ''
console.log(storedData);

// But TS has a nullish coalesving operator for null or undefined
const storedData = userInput ?? "DEFAULT";
