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

## Section 9: Practice Time! Let's Build a Drag and Drop Project

A walk through how to build a basic (but not simple!) ~400 line drag and drop project management interface using everything we've learned thus far.

## Section 10: Modules & Namespaces

Lots of great stuff here about namespaces and es6 modules, how to use them, how to configure HTML and `tsconfig` to use them, why to use them, best practices, pitfalls, etc. All of the code from Section 9 is broken out into multiple files and passed around using namespaces.

## Section 11: Using Webpack with TypeScript

Pretty good intro to Webpack, but didn't have a whole lot to do with TypeScript. It primarily shows how to take all of the files that were broken out in section 10 and use Webpack to bundle them into one lightening fast file ready to be deployed to your server.

There were definitely some issues with the course content having to do with updates to Webpack since it was written:

1.  `webpack.config.js` needs some edits. Specifically:

- In `output`, `"publicPath"` needs to be set to `"\dist\"` and not `"dist"`.
- The following section needs to be added to work with `webpack-dev-server`:

```javascript
  devServer: {
    static: './',
  },
```

2.  In `webpack.config.prod.js`, `"devtool"` needs to be completely removed, and not simply set to `"none"`.

## Section 12: 3rd Party Libraries & Typescript

- Covers NPM's [@types library](https://www.npmjs.com/~types), which contains type definitions for many JS 3rd party libraries.
- Shows how to use `declare` to define types that might not otherwise be defined.
- Shows how to convert data from wherever to conform with your created types Typescript types using [Typestack's `class-transformer`](https://github.com/typestack/class-transformer).
- Delightfully invokes the powerful decorators in [Typestack's `class-validator`](https://github.com/typestack/class-validator).

## Section 13: Time to Practice! Let's Build a Google Maps App!

Covers using the Google Maps API in Typescript, specifically by adding `@types/google.maps` to add TS Types to the API. It's pretty open-ended so a good place to continue to experiment with TS.

### Because Sections 14 and 15 require their own special NPM setups, Section 13 is stored in the root `src` project folder.

## Section 14: React.js & Typescript

Build a simple CRUD React app with Typescripty goodness. Also contains a general discussion of React and Typescript, and where to find resources. The app gives a good example of how to communicate from component to component using `res.` The section does not cover much React, as the author points out repeatedly.

## Section 15: Node.js + Express & Typescript

Begins with discussion of how Node does not understand Typescript, but simply treats whatever you pass to it as Javascript without caring about the file extension. Also gives quick introduction to [TSNode](https://typestrong.org/ts-node/) before moving on from it because constantly compiling TS on the server would likely be slow. Which brings us to a custom setup using Node, Express, and BodyParser. From there we build an MVC CRUD app which can be tested in Postman. It follows a very parallel content to section 14, but this time with Express. Pretty cool! It concludes with a recommendation to check out [Nest.js](https://nestjs.com/), which provides "great Typescript support out-of-the-box."

## Section 16: Course Roundup

The author closes the course with a review of what we've done, a link to the Typescript.js and Next.js web pages, and a greate suggestion to [search for "typescript examples"](https://www.google.com/search?q=typescript+examples&oq=typescript+examples&aqs=chrome..69i57j0i512j0i22i30l8.5313j0j7&sourceid=chrome&ie=UTF-8)).

# TODO:

~~The project sections do not revert back to white when something is dropped on them.~~

# Notes:

The favicons were probably unnecessary, but the error message was distracting me in the browser.

I added this to the HTML page to stop an "exports not defined" error that shows up pretty much at random:

```javascript
<script>var exports = {};</script>
```

`target` is set to `es6` and `experimentalDecorators` is set to `true` in `tsconfig.json` per the course instructions for Section 8.
