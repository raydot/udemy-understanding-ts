# udemy-understanding-ts

Following Maximilian Schwarzmüller's "Understanding Typescript" on Udemy

# Course Content

## Section 1: Getting Started

## Section 2: Typescript Basics & Basic Types

Hands on chapter that goes over all begging TS usage and types

## Section 3: The TypeScript Compiler

Deep dive into TS configuration, centered mostly around `tsconfig.json`. Short section on debugging with MSVS Code.

## Section 4: Next-generation Javascript & Typescript

Review of "new" ES6 features and how they relate to TS. Specifically, `let` and `const`, arrow functions, default function parameters, spread operator (`...`), rest parameters, and array & object destructuring.

## Section 5: Classes & Interfaces

Coverages of classes , constructors, public, private, singletons, interfaces. I unfortunately wiped out all of the work I did for this section with a single foolish click of the mouse, so the code that's there for this section is the default from the class and has no notes.

## Section 6: Advanced Types

Interesting coverage of advanced TS types and patterns including type guards, discriminate unions, typecasting, index properties, function overloads, optional chaining, and nullish coalescing.

## Section 7: Generics

Max should write a book, because this was a great explanation of generics. In addition to explaining what generics are, how they're constructed and what they're used for, this section also covers why/how to add constraints, using the `keyof` constraint, working with generic classes, genric utility types, and the difference between generic types and union types.

Links:
[Typescript Utility types documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)
[Typescript Genrics documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html) (Page liked from course is deprecated, this is the updated page.)

## Section 8: Decorators

_Mindblowing_ introduction to [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html). 🚀 Worth it for just the `Autobind` demonstration alone. Section covers decorators in their general use, decorator factories, how decorators work differently with classes, properties, accessors, methods and parameters, how decorators execute on the JS stack, an example of them being used to override class constructors (wow!), and validation with decorators. The validation with decorators builds a simple version of [Typestack's `class-validator` library](https://github.com/typestack/class-validator), and discusses decorators in the context of both Angular and the [Nest.js server](https://nestjs.com/).

# Notes:

The favicons were probably unnecessary, but the error message distracting me in the browser.

I added this to the HTML page to stop an "exports not defined" error that shows up pretty much at random.

```javascript
<script>var exports = {};</script>
```

`target` is set to `es6` and `experimentalDecorators` is set to `true` in `tsconfig.json` per the course instructions for Section 8.
