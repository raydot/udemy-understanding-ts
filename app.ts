// Drag & Drop interfaces
interface Draggable {
  // Listeners
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
// So we have project objects with the same structure

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
// type Listener = (items: Project[]) => void;

// refactoring into the class, we might have more kinds of types
type Listener<T> = (items: T[]) => void;

// Let's also refactor project state
// Even though it's small in this project,
// it could easily be a lot more complex than this.

class State<T> {
  // listeners listening for change in array of function references
  // that is the listenerFn of each listener
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
  // list of projects
  //private projects: any[] = [];
  // No longer any now that we have the Project class
  private projects: Project[] = [];
  // listeners listening for change in array of function references
  // that is the listenerFn of each listener
  // Moved into the State class.
  // private listeners: Listener[] = [];
  // static instance
  private static instance: ProjectState;

  private constructor() {
    // Need access to the State class
    super();
  }

  // Singleton pattern
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } // else
    this.instance = new ProjectState();
    return this.instance;
  }

  // Moved into the class
  // addListener(listenerFn: Listener) {
  //   this.listeners.push(listenerFn);
  // }

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
    this.updateListeners();
    // moved this to updateListeners()
    // for (const listenerFn of this.listeners) {
    //   // Slice so you get a copy and not the original
    //   // since arrays are passed by reference.
    //   // All get excuted with a copy.
    //   listenerFn(this.projects.slice());
    // }
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    // Second check avoids re-rendering if nothing's changed
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
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
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
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

// Component Base Class
// UI Components which are renderable objects
// abstract because it should only be used for inheritance
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  // Might not always be a DIV, sometimes a UL or something else
  //hostElement: HTMLDivElement;
  // And this is more specifically: a form element
  // So let's use HTMLElement and extend from there.
  //element: HTMLElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  // (BTW, no such thing as "private abstract")
  // Any class inheriting from component will need to add these two methods
  abstract configure(): void;
  abstract renderContent(): void;
}

// Let's create a class for items instead of using a ProjectList variable
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  // getter used to output the right text for people
  // A getter can be used to help transform data when we retrieve it.
  get people() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} people`;
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  // Using the interface, we now have a contract for these methods:
  // And say hello to our old friend autobind, which helps us bind
  // Handlers to listeners
  @autobind
  dragStartHandler(event: DragEvent) {
    //console.log(event);
    // Could be null depending on where it originates
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent) {
    console.log('Drag end man!');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    // this.element.querySelector("h3")!.textContent =
    //this.project.people.toString() + " assigned";
    // use the getter instead
    this.element.querySelector('h3')!.textContent = `${this.people} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

// ProjectList Class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  // Now we've abstracted to the Component class,
  // So let's clean up this one
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLElement;
  assignedProjects: Project[];

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      // Default for JS events is to NOT allow dragging
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    //console.log(event.dataTransfer!.getData("text/plain"));
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      prjId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  constructor(private type: 'active' | 'finished') {
    // Need to call the contructor of the Component base class
    super('project-list', 'app', false, `${type}-projects`);
    // variables for the template and host
    // Now passed in to the constructor...
    // this.templateElement = document.getElementById(
    //   "project-list"
    // )! as HTMLTemplateElement;
    // Also passed in...
    // this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = []; // holds list of assigned projects

    // render the form
    // Now handled in uber class
    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true
    // );
    // this.element = importedNode.firstElementChild as HTMLFormElement;
    // Add an id to the element for styling
    //this.element.id = `${this.type}-projects`;

    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  // Removing "private" because an abstract class -- the one in the
  // base class -- cannot be private.
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    // Let's modify to use the ProjectItem Class
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    // Clear everything out and re-render so we don't get dupes
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      // refactoring to work with ProjectList class
      // const listItem = document.createElement("li");
      // listItem.textContent = prjItem.title;
      // listEl.appendChild(listItem);
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }

  // // No longer needed, now happens in base class
  // // this.attach();
  // this.renderContent();

  // private attach() {
  //   // Take the node and insert it after the start
  //   this.hostElement.insertAdjacentElement("beforeend", this.element);
  // }
}
// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // get access to the template and render in the app div
  // Now handled by the Component class
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLFormElement;

  // form inputs
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Need it to work with the Component class
    super('project-input', 'app', true, 'user-input');
    // variables for the template and host
    // Now all handled by the Component class
    // this.templateElement = document.getElementById(
    //   "project-input"
    // )! as HTMLTemplateElement;
    // this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // // render the form
    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true
    // );
    // this.element = importedNode.firstElementChild as HTMLFormElement;
    // // Add an id to the element for styling
    // this.element.id = "user-input";
    // Moved here from the contructor
    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    // this.attach();
  }

  // Can't be private, per the base class
  configure() {
    // Don't need bind now that we've got @autobind
    // this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener('submit', this.submitHandler);
  }

  // Not using, but needed to extend the base class
  renderContent() {}

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
      alert('INVALID INPUT, please try again');
      return; // so typescript knows we're getting SOMETHING back
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
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

  // No longer needed, in Contructor
  // private attach() {
  //   // Take the node and insert it after the start
  //   this.hostElement.insertAdjacentElement("afterbegin", this.element);
  // }
}

// Instantiate the class and you'll see the form.
const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
