export class Todo {
  // With this syntax, TS will automatically create
  // the appropriate fields as well.  Remember:
  // every class acts as a type
  constructor(public id: string, public text: string) {}
}
