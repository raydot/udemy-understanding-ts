import { createNoSubstitutionTemplateLiteral } from "typescript";

// Just because it has the one abstract, you need to make the whole class abstract
abstract class Department {
  static fiscalYear = 2020;
  //private id: string
  // private name: string; // notice no let or const, field of a class
  // private = only accessible within class
  private employees: string[] = [];

  //readonly adds more type safety
  // changed id to protected so we can use it in derived classes
  constructor(protected readonly id: string, public name: string) {
    // note, keeps from redefining!
    //this.name = n;
    //this.id = id

    // This wont work, because fy is STATIC!
    // console.log(this.fiscalyear)
    // This will work
    console.log(Department.fiscalYear);
  }

  static createEmployee(name: string) {
    return { name: name };
  }

  // method
  //  describe(this: Department) {
  //   // method body
  //    console.log(`Department:  (${this.id})  ${this.name}`);
  // }

  // Abstract a method when you want to make sure that any derived class has it
  // but you can't guarantee the implementation.]
  // Abstract classes provide concrete implementations
  // Cannot be instantiated themselves.
  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  constructor(id: string, public admins: string[]) {
    // call constructor of base class
    super(id, "IT");
  }

  // Must have this because of the abstract class in department
  describe() {
    console.log("ID DEPARTMENT" + this.id);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  // Let's do this so we can use this as a singleton.
  private static instance: AccountingDepartment;

  // getter.  Need to return something
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error("No report found!");
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error("Please pass in a value!");
    }
    this.addReport(value);
  }

  // This makes it a singleton...
  private constructor(id: string, private reports: string[]) {
    super(id, "ACC123");
  }

  static getInstance() {
    if (AccountingDepartment.instance) {
      // or AccountingDepartment.instance
      return this.instance;
    }
    this.instance = new AccountingDepartment("d2", ["Bill", "Jane"]);
    return this.instance;
  }

  addEmployee(name: string) {
    if (name === "Max") {
      return;
    }
    // This wont work, is private in parent class!
    // Must use "protected" instead
    // this.employees.push(name)
  }

  describe() {
    console.log("account department ID:" + this.id);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }
  printReports() {
    console.log(`Reports: ${this.reports}`);
  }
}

// This doesn't work anymore now that we've made a singleton.
// const accounting = new AccountingDepartment("x0103", [
//   "All systems go!",
//   "Abort!",
// ]);

// But we can do this:
const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

//  Use the Department static method
const employee1 = Department.createEmployee("Bobo");
console.log(employee1, Department.fiscalYear);

accounting.addReport("Oh no, big problem!");
accounting.printReports();
// console.log(accounting);

// use the getter
console.log(accounting.mostRecentReport);

// use the setter wrong, throws error
//accounting.mostRecentReport = "";

// use the setter right
accounting.mostRecentReport = "The truth is out there!";

accounting.addEmployee("Dave");
accounting.addEmployee("Lulu");

// won't work, method is private!
// accounting.employees[2] = "Joliet";

// accounting.describe();
// accounting.printEmployeeInformation();
// These are the same object with the singleton pattern
accounting.describe();
accounting2.describe();
console.log(accounting);
console.log(accounting2);

// const accountingCopy = {
//   name: "ACCOUNTINGCOPY",
//   describe: accounting.describe,
// };

// // Returns undefined because "this" is not defined in accounting copy

const it = new ITDepartment("x0105", ["Mary", "Nicole"]);
it.describe();
it.name = "Phineas Newe";
it.printEmployeeInformation();

// Static, adds methods and properties that you don't access from
// an instantiated object but only from the class itself.
// Example is the JS "Math" class, which you don't have to
// instiantiate to use.
