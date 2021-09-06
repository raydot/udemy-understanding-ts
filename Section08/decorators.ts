// DECORATORS
// Meta-Programming
// Stuff your user doesn't see, but helps other programmers
// A decorator is just a function
// convention is to start with UCC
// It receives the constructor object of the attached class!  Cool!
// function Logger(constructor: Function) {
//   console.log("Logging...");
//   console.log(constructor);
// }

import { validateLocaleAndSetLanguage } from "typescript";

// Decorator factory
// Returns decorator, which we can configure as we need
// with as many arguments as we want
function Logger(logString: string) {
  console.log("LOGGER FACTORY");
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}
//@Logger() // decorator as function so it can receive parameters
// @Logger("LOGGING - PERSON")

// Let's use this to do stuff!
// Render the name passed into the person class using the decorator
// function WithTemplate(template: string, hookId: string) {
//   // return function (_: Function) {
//   //  _: means "I know it's coming in, I don't need it"
//   return function (constructor: any) {
//     console.log("RENDERING TEMPLATE");
//     const hookEl = document.getElementById(hookId);
//     const p = new constructor();
//     if (hookEl) {
//       hookEl.innerHTML = template;
//       hookEl.querySelector("h1")!.textContent = p.name;
//     }
//   };
// }

// Here is a new WithTemplate that's used to show how to modify
// a class constructor with a decerator
// Some decorators can return values
// this is a decorator added to a class, so let's return
// a new constructor!
function WithTemplate(template: string, hookId: string) {
  console.log("TEMPLATE FACTORY");
  // This is litertally overriding the instantiation with the decorator's
  // own version  of new!  It extends the existing class but extends /
  // replaces it with logic of its own!

  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        // ..._ sure, you can pass me something but I'm gonna ignore it
        // Still execute the old logic, but add new logic
        // And now this only happens when I instantiate
        // not just on definition of decorator
        super(); // saves everything in the original class
        // Extra logic that executes when the class is instantiated
        console.log("RENDERING TEMPLATE");
        const hookEl = document.getElementById(hookId);
        const p = new originalConstructor();
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

@Logger("LOGGING")
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
  // Comment this out and it will throw an error with the new WithTemplate
  // because that's expecting a string called name
  name = "Thomas";

  constructor() {
    console.log("Creating person object...");
  }
}

// If you comment this out, everything still fires up but you don't
// get the name on screen because our fancy new class decorator constructor
// function goes unused!
// const pers = new Person();
// console.log(pers);

// Running from here shows "Logging" first, the the decorator, then "Creating person object..."

// Decorators run from the bottom up

// ----- types of decorators
// you can return things from methods and accessor decorators, but not others
// Property decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator!");
  console.log(target, propertyName);
}

// Accessor decorator, tied to the setter here
// Gets target (prototype of accessor function), name, property descriptor
// PropertyDescriptor is a TS and vanilla JS type
// contains things like configurable, eneumerable, etc...
// it's also a kind of object, and totally configurable!
// Example below in method decorator...
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// method decorator, tied to getPriceWithTax method
// Gets target, name of method, method descriptor
// Target = method prototype if instance method, constructor function if static method
// More or less same as accessor
function Log3(
  target: any,
  name: string | symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// parameter decorator
// Aeded to the tax parmeter in product
// target, name of method in which param is used, position of the argument in the method (0 in this case)
function Log4(target: any, name: string | symbol, position: number) {
  console.log("Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}
class Product {
  // Decorator as a property
  // takes two arguments: target, property name
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    // accessor
    if (val > 0) {
      // Don't accept negative price
      this._price = val;
    } else {
      throw new Error("Hey man, stay positive!");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this.price * (1 + tax);
  }
}

// Product is never instantiated, so decorator executes when
// class definition is reached.

// Instantiating does not at all change the output order
// or create more usage.  NOT CALLED AT RUNTIME, called at definition
// They're not event listeners.
const p1 = new Product("Book", 21);
const p2 = new Product("Bowl", 77);

// target binds to the prototype
// Remember: A method is just a property with a function as the value
// So 'value' property will point to the proper method
// Original prototype, but turns out we're not that interested in the target
// or methodName
// function Autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // Always set 'this' to the object the method is bound to
  const originalMethod = descriptor.value;
  // Replace original property description with this bitchin' custom one
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // like 'value' property with extra logic
      // 'this' refers to whatever's responsible for triggering get()
      // get is triggred by the object to which it belongs
      // will not be overridden by listener, serves as a kind of buffer
      // This line does the binding you want:
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
class Printer {
  message = "This works";

  @Autobind
  showMessage() {
    // this context is the target of the event
    // could use p.showMessage.bind(p) to bind it to Printer,
    // but let's create an autobind decorator instead!
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector("button");
button.addEventListener("click", p.showMessage);

// -- DECORATORS FOR VALIDATION
// This logic could all be a 3rd party library and all you'd
// have to do is add the decorator to your classes.  Sweet!
// Let's create a naive validator:
interface ValidatorConfig {
  [property: string]: {
    // index type notation
    [validateableProp: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

// Course name decorator
// Property decoration function
function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name], // make sure we grab the exising validators!
    [propName]: ["required"], // naive, assumes no other validators
  };
}

// Course price decorator
function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ["positive"],
  };
}

// Go through validators, act depending on what it finds
function validate(obj: any) {
  // validation logic, 'any' so it's flexible, maybe not best approach, but...
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    // nothing to validate, must be all good!
    return true;
  }
  let isValid = true;
  // property names for which we have validators
  for (const prop in objValidatorConfig) {
    // go through all validators we might have for a given property
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          // return !!obj[prop]; // double bang converts to boolean
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          // return obj[prop] > 0;
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}
class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

// Let's validate our info.
const courseForm = document.querySelector("form")!; // ! because it will never be null
courseForm.addEventListener("submit", (event) => {
  event.preventDefault(); // not actually going to be submitting anything
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    throw new Error("INPUT ERROR!");
  }
  console.log(createdCourse);
});
