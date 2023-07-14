interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

interface IEmployeeOrgApp {
  ceo: Employee;
  move(employeeID: number, supervisorID: number): void;
  undo(): void;
  redo(): void;
}

function cloneEmployeeHierarchy(employee: Employee): Employee {
  const clonedEmployee: Employee = {
    uniqueId: employee.uniqueId,
    name: employee.name,
    subordinates: [],
  };

  for (const subordinate of employee.subordinates) {
    const clonedSubordinate = cloneEmployeeHierarchy(subordinate);
    clonedEmployee.subordinates.push(clonedSubordinate);
  }

  return clonedEmployee;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  private history: Employee[];
  private currentIndex: number;

  constructor(public ceo: Employee) {
    this.history = [cloneEmployeeHierarchy(ceo)];
    this.currentIndex = 0;
  }

  move(employeeID: number, supervisorID: number): void {
    const employee = this.findEmployee(this.ceo, employeeID);
    const fromSupervisor = this.findSupervisor(this.ceo, employeeID);
    const toSupervisor = this.findEmployee(this.ceo, supervisorID);

    if (!employee || !fromSupervisor || !toSupervisor) {
      throw new Error("Invalid employee or supervisor ID");
    }

    const historyCopy = cloneEmployeeHierarchy(this.history[this.currentIndex]);
    this.history.splice(this.currentIndex + 1);
    this.history.push(historyCopy);
    this.currentIndex = this.history.length - 1;

    // Remove employee from old supervisor's subordinates
    const fromSubordinates = fromSupervisor.subordinates;
    let employeeIndex = -1;
    for (let i = 0; i < fromSubordinates.length; i++) {
      if (fromSubordinates[i].uniqueId === employeeID) {
        employeeIndex = i;
        break;
      }
    }
    if (employeeIndex !== -1) {
      const [movedEmployee] = fromSubordinates.splice(employeeIndex, 1);
      movedEmployee.subordinates.forEach(subordinate => {
        fromSupervisor.subordinates.push(subordinate);
      });
      movedEmployee.subordinates.length = 0;
    }

    // Add employee to new supervisor's subordinates
    toSupervisor.subordinates.push(employee);
  }

  undo(): void {
    if (this.currentIndex <= 0) {
      throw new Error("No actions to undo");
    }

    const currentHierarchy = this.history[this.currentIndex];
    const previousHierarchy = this.history[this.currentIndex - 1];

    // Find the differences between the current and previous hierarchy
    const differences = this.findHierarchyDifferences(currentHierarchy, previousHierarchy);

    // Move the employees back to their previous supervisors
    for (const difference of differences) {
      const { employeeID, previousSupervisorID } = difference;
      this.move(employeeID, previousSupervisorID);
    }

    this.currentIndex--;
    this.ceo = cloneEmployeeHierarchy(previousHierarchy);

    clearHierarchy();
    displayHierarchy(this.ceo);
  }

  redo(): void {
    if (this.currentIndex >= this.history.length - 1) {
      throw new Error("No actions to redo");
    }

    this.currentIndex++;
    this.ceo = cloneEmployeeHierarchy(this.history[this.currentIndex]);

    clearHierarchy();
    displayHierarchy(this.ceo);
  }

  private findEmployee(manager: Employee, employeeID: number): Employee | undefined {
    if (manager.uniqueId === employeeID) {
      return manager;
    }

    for (const subordinate of manager.subordinates) {
      const foundEmployee = this.findEmployee(subordinate, employeeID);
      if (foundEmployee) {
        return foundEmployee;
      }
    }

    return undefined;
  }

  private findSupervisor(manager: Employee, employeeID: number): Employee | undefined {
    if (manager.subordinates.some(subordinate => subordinate.uniqueId === employeeID)) {
      return manager;
    }

    for (const subordinate of manager.subordinates) {
      const foundSupervisor = this.findSupervisor(subordinate, employeeID);
      if (foundSupervisor) {
        return foundSupervisor;
      }
    }

    return undefined;
  }

  private findHierarchyDifferences(currentHierarchy: Employee, previousHierarchy: Employee): EmployeeDifference[] {
    const differences: EmployeeDifference[] = [];

    this.findEmployeeDifferences(currentHierarchy, previousHierarchy, differences);

    return differences;
  }

  private findEmployeeDifferences(currentEmployee: Employee, previousEmployee: Employee, differences: EmployeeDifference[], previousSupervisorID?: number): void {
    if (currentEmployee.uniqueId !== previousEmployee.uniqueId || currentEmployee.subordinates.length !== previousEmployee.subordinates.length || previousSupervisorID !== undefined) {
      differences.push({
        employeeID: currentEmployee.uniqueId,
        previousSupervisorID: previousSupervisorID !== undefined ? previousSupervisorID : currentEmployee.uniqueId,
      });
    }

    for (let i = 0; i < currentEmployee.subordinates.length; i++) {
      const currentSubordinate = currentEmployee.subordinates[i];
      const previousSubordinate = previousEmployee.subordinates[i];
      this.findEmployeeDifferences(currentSubordinate, previousSubordinate, differences, previousEmployee.uniqueId);
    }
  }
}

// Function to display the hierarchy

const ceo: Employee = {
  uniqueId: 1,
  name: "John Smith",
  subordinates: [
    {
      uniqueId: 2,
      name: "Margot Donald",
      subordinates: [
        {
          uniqueId: 3,
          name: "Cassandra Reynolds",
          subordinates: [
            {
              uniqueId: 4,
              name: "Mary Blue",
              subordinates: [],
            },
            {
              uniqueId: 5,
              name: "Bob Saget",
              subordinates: [
                {
                  uniqueId: 6,
                  name: "Tina Teff",
                  subordinates: [
                    {
                      uniqueId: 7,
                      name: "Will Turner",
                      subordinates: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      uniqueId: 8,
      name: "Tyler Simpson",
      subordinates: [
        {
          uniqueId: 9,
          name: "Harry Tobs",
          subordinates: [
            {
              uniqueId: 10,
              name: "Thomas Brown",
              subordinates: [],
            },
          ],
        },
        {
          uniqueId: 11,
          name: "George Carrey",
          subordinates: [],
        },
        {
          uniqueId: 12,
          name: "Gary Styles",
          subordinates: [],
        },
      ],
    },
    {
      uniqueId: 13,
      name: "Ben Willis",
      subordinates: [],
    },
    {
      uniqueId: 14,
      name: "Georgina Flangy",
      subordinates: [
        {
          uniqueId: 15,
          name: "Sophie Turner",
          subordinates: [],
        },
      ],
    },
  ],
};
const app = new EmployeeOrgApp(ceo);

// Function to display the hierarchy on the HTML page
function displayHierarchy(employee: Employee, indent = " "): void {
  const indentation = `${indent}  `;
  const employeeName = `${indentation}(${employee.uniqueId})${employee.name}`;
  document.getElementById("hierarchyOutput").textContent += employeeName + "\n";
  for (const subordinate of employee.subordinates) {
    displayHierarchy(subordinate, `${indentation}`);
  }
}

function clearHierarchy(): void {
  document.getElementById("hierarchyOutput").textContent = "";
}

// Function to move an employee based on user input
function handleMove(): void {
  const employeeID = parseInt(
    (<HTMLInputElement>document.getElementById("employeeID")).value
  );
  const supervisorID = parseInt(
    (<HTMLInputElement>document.getElementById("supervisorID")).value
  );

  try {
    app.move(employeeID, supervisorID);
    clearHierarchy();
    displayHierarchy(ceo);
  } catch (error) {
    document.getElementById("errorMessage").textContent = error.message;
    console.error(error);
  }
}

// Function to undo the last move action
function handleUndo(): void {
  try {
    app.undo();
    clearHierarchy();
    displayHierarchy(ceo);
  } catch (error) {
    console.error(error);
  }
}

// Function to redo the last undone action
function handleRedo(): void {
  try {
    app.redo();
    clearHierarchy();
    displayHierarchy(ceo);
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("moveButton").addEventListener("click", handleMove);
document.getElementById("undoButton").addEventListener("click", handleUndo);
document.getElementById("redoButton").addEventListener("click", handleRedo);

displayHierarchy(ceo);
