// Unknown is better than any if you don't know the type.

let userInput: unknown;
let userName: string;

userInput = 5;
userInput = "Dave Rules";
// userName = userInput; // no good!  Can't assign to string
if (typeof userInput === "string") {
  userName = userInput; // this works!  TS picks up the type check
}

// Never type
// What does this function return?  Nothing, ever!  It's gonna hose your browser.
// Job for never.
function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
}

generateError("An error occurred!", 500);
