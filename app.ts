// Project Type
// So we have project objects with the same structur

// Let's enum the project types!
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus // enum type
  ) {}
}

// Project State Management
// encode a function type with one word
// remember, everything in the listener array is a function
type Listener = (items: Project[]) => void;
class ProjectState {
  // list of projects
  //private projects: any[] = [];
  // No longer any now that we have the Project class
  private projects: Project[] = [];
  // listeners listening for change in array of function references
  // that is the listenerFn of each listener
  private listeners: Listener[] = [];
  // static instance
  private static instance: ProjectState;

  private constructor() {}

  // Singleton pattern
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } // else
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    // const newProject = {
    //   // generate random id
    //   id: Math.random().toString(),
    //   title: title,
    //   description: description,
    //   people: numOfPeople,
    // };
    // We have the Project class now so let's use it!
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      // Slice so you get a copy and not the original
      // since arrays are passed by reference.
      // All get excuted with a copy.
      listenerFn(this.projects.slice());
    }
  }
}

// Global instance of project state
const projectState = ProjectState.getInstance();

// define structure of validatable object
interface Validatable {
  value: string | number;
  required?: boolean;
  // Length of value
  minLength?: number;
  maxLength?: number;
  // Value of value
  min?: number;
  max?: number;
}

// Validate funciton
function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    // Just treat everything as a string for checking so we don't have to
    // create a bunch of reduntant calls for every data type
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  // Null in case minlength is set to zero, checks for undefined or null
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// autobind decorator
function autobind(
  // Again, underscore means I'm getting it, but not using it.
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    // variables for the template and host
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = []; // holds list of assigned projects

    // render the form
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // Add an id to the element for styling
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if ((this.type = "active")) {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    // Clear everything out and re-render so we don't get dupes
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    // Take the node and insert it after the start
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}
// ProjectInput class
class ProjectInput {
  // get access to the template and render in the app div
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  // form inputs
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // variables for the template and host
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // render the form
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // Add an id to the element for styling
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  // [string, string, number] means we're expecting a tuple with exactly these types of data
  private gatherUserInput(): [string, string, number] | void {
    // 'void' because the entry might be invalid and then we just return
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // Poor man's validatation
    // if (
    //   enteredTitle.trim().length === 0 ||
    //   enteredDescription.trim().length === 0 ||
    //   enteredPeople.trim().length === 0
    // )

    // Little better validation
    // if (
    //   validate({ value: enteredTitle, required: true, minLength: 5 }) &&
    //   validate({ value: enteredDescription, required: true, minLength: 5 }) &&
    //   validate({ value: enteredPeople, required: true, minLength: 5 })
    // ) {

    // Replace with our fancy new validator:
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("INVALID INPUT, please try again");
      return; // so typescript knows we're getting SOMETHING back
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  // Handle submission
  @autobind // Use a decorator to solve that pesky binding problem
  private submitHandler(event: Event) {
    event.preventDefault();
    // Doesn't work!  Oops, configure is bound to the eventListener not the event
    // Adding bind() to the callback binds "this" to this handler
    //console.log(this.titleInputElement.value);
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      // Pass that data to the ProjectState singleton
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    // Don't need bind now that we've got @autobind
    // this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    // Take the node and insert it after the start
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// Instantiate the class and you'll see the form.
const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
