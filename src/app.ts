// How to import from namespace
// note THREE slashes
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-list.ts"/>

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
