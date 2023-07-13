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
  
      this.history.push({
        employeeID,
        fromSupervisor,
        toSupervisor,
      });
  
      // Remove employee from old supervisor's subordinates
      const fromSubordinates = fromSupervisor.subordinates;
      const employeeIndex = fromSubordinates.findIndex(
        (subordinate) => subordinate.uniqueId === employeeID
      );
      fromSubordinates.splice(employeeIndex, 1);
  
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
      const employeeIndex = toSubordinates.findIndex(
        (subordinate) => subordinate.uniqueId === employeeID
      );
      toSubordinates.splice(employeeIndex, 1);
  
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
  function displayHierarchy(employee: Employee, indent = ' '): void {
    const indentation = `${indent}  `;
    console.log(`${indentation}${employee.name}`);
    for (const subordinate of employee.subordinates) {
      displayHierarchy(subordinate, `${indentation}`);
    }
  }
  
  // Create the employee hierarchy
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
  
  // Usage example
  const app = new EmployeeOrgApp(ceo);
  displayHierarchy(ceo); //before changing Hierarchy
  app.move(7, 2); // Move Bob Saget to be subordinate of Cassandra Reynolds
  
  // Display the hierarchy
  displayHierarchy(ceo);
  
  console.log("<------------------------------------------------------------------------------------->");
    
  app.undo(); // Undo the move action
  
  // Display the hierarchy again
  displayHierarchy(ceo);
  
  console.log("<------------------------------------------------------------------------------------->");
    