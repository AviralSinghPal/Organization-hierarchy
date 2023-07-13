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

class EmployeeOrgApp implements IEmployeeOrgApp {
  private history: {
    employeeID: number;
    fromSupervisor: Employee;
    toSupervisor: Employee;
  }[];

  constructor(public ceo: Employee) {
    this.history = [];
  }

  move(employeeID: number, supervisorID: number): void {
    const employee = this.findEmployee(this.ceo, employeeID);
    const fromSupervisor = this.findSupervisor(this.ceo, employeeID);
    const toSupervisor = this.findEmployee(this.ceo, supervisorID);
  
    if (!employee || !fromSupervisor || !toSupervisor) {
      throw new Error('Invalid employee or supervisor ID');
    }
    if (supervisorID >= employeeID) {
      throw new Error('Supervisor ID should be less than the employee ID.');
    }
  
    this.history.push({
      employeeID,
      fromSupervisor,
      toSupervisor,
    });
  
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
      fromSubordinates.splice(employeeIndex, 1);
    }
  
    // Add employee to new supervisor's subordinates
    toSupervisor.subordinates.push(employee);
  }
  
  undo(): void {
    const lastAction = this.history.pop();
    if (!lastAction) {
      throw new Error('No actions to undo');
    }
  
    const { employeeID, fromSupervisor, toSupervisor } = lastAction;
    const employee = this.findEmployee(this.ceo, employeeID);
  
    if (!employee) {
      throw new Error('Invalid employee ID');
    }
  
    // Remove employee from new supervisor's subordinates
    const toSubordinates = toSupervisor.subordinates;
    let employeeIndex = -1;
    for (let i = 0; i < toSubordinates.length; i++) {
      if (toSubordinates[i].uniqueId === employeeID) {
        employeeIndex = i;
        break;
      }
    }
    if (employeeIndex !== -1) {
      toSubordinates.splice(employeeIndex, 1);
    }
  
    // Add employee back to old supervisor's subordinates
    fromSupervisor.subordinates.push(employee);
  }
  

  redo(): void {
    throw new Error('Redo feature is not implemented');
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
    if (manager.subordinates.some((subordinate) => subordinate.uniqueId === employeeID)) {
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
}

// Function to display the hierarchy

const ceo: Employee = {
  uniqueId: 1,
  name: 'John Smith',
  subordinates: [
    {
      uniqueId: 2,
      name: 'Margot Donald',
      subordinates: [
        {
          uniqueId: 3,
          name: 'Cassandra Reynolds',
          subordinates: [
            {
              uniqueId: 4,
              name: 'Mary Blue',
              subordinates: [],
            },
            {
              uniqueId: 5,
              name: 'Bob Saget',
              subordinates: [
                {
                  uniqueId: 6,
                  name: 'Tina Teff',
                  subordinates: [
                    {
                      uniqueId: 7,
                      name: 'Will Turner',
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
      name: 'Tyler Simpson',
      subordinates: [
        {
          uniqueId: 9,
          name: 'Harry Tobs',
          subordinates: [
            {
              uniqueId: 10,
              name: 'Thomas Brown',
              subordinates: [],
            },
          ],
        },
        {
          uniqueId: 11,
          name: 'George Carrey',
          subordinates: [],
        },
        {
          uniqueId: 12,
          name: 'Gary Styles',
          subordinates: [],
        },
      ],
    },
    {
      uniqueId: 13,
      name: 'Ben Willis',
      subordinates: [],
    },
    {
      uniqueId: 14,
      name: 'Georgina Flangy',
      subordinates: [
        {
          uniqueId: 15,
          name: 'Sophie Turner',
          subordinates: [],
        },
      ],
    },
  ],
};
const app = new EmployeeOrgApp(ceo);


// Function to display the hierarchy on the HTML page
function displayHierarchy(employee: Employee, indent = ' '): void {
  const indentation = `${indent}  `;
  const employeeName = `${indentation}${employee.uniqueId}-${employee.name}`;
  document.getElementById('hierarchyOutput').textContent += employeeName + '\n';
  for (const subordinate of employee.subordinates) {
    displayHierarchy(subordinate, `${indentation}`);
  }
}

// Function to clear the hierarchy output
function clearHierarchy(): void {
  document.getElementById('hierarchyOutput').textContent = '';
}

// Function to move an employee based on user input
function handleMove(): void {
  const employeeID = parseInt((<HTMLInputElement>document.getElementById('employeeID')).value);
  const supervisorID = parseInt((<HTMLInputElement>document.getElementById('supervisorID')).value);

  try {
    app.move(employeeID, supervisorID);
    clearHierarchy();
    displayHierarchy(ceo);
  } catch (error) {
    document.getElementById('errorMessage').textContent = error.message;
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



// Add event listeners to the buttons
document.getElementById('moveButton').addEventListener('click', handleMove);
document.getElementById('undoButton').addEventListener('click', handleUndo);
document.getElementById('redoButton').addEventListener('click', handleRedo);




// Display the hierarchy
displayHierarchy(ceo);

