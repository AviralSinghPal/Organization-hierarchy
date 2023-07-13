var EmployeeOrgApp = /** @class */ (function () {
    function EmployeeOrgApp(ceo) {
        this.ceo = ceo;
        this.history = [];
    }
    EmployeeOrgApp.prototype.move = function (employeeID, supervisorID) {
        var employee = this.findEmployee(this.ceo, employeeID);
        var fromSupervisor = this.findSupervisor(this.ceo, employeeID);
        var toSupervisor = this.findEmployee(this.ceo, supervisorID);
        if (!employee || !fromSupervisor || !toSupervisor) {
            throw new Error('Invalid employee or supervisor ID');
        }
        this.history.push({
            employeeID: employeeID,
            fromSupervisor: fromSupervisor,
            toSupervisor: toSupervisor,
        });
        // Remove employee from old supervisor's subordinates
        var fromSubordinates = fromSupervisor.subordinates;
        var employeeIndex = -1;
        for (var i = 0; i < fromSubordinates.length; i++) {
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
    };
    EmployeeOrgApp.prototype.undo = function () {
        var lastAction = this.history.pop();
        if (!lastAction) {
            throw new Error('No actions to undo');
        }
        var employeeID = lastAction.employeeID, fromSupervisor = lastAction.fromSupervisor, toSupervisor = lastAction.toSupervisor;
        var employee = this.findEmployee(this.ceo, employeeID);
        if (!employee) {
            throw new Error('Invalid employee ID');
        }
        // Remove employee from new supervisor's subordinates
        var toSubordinates = toSupervisor.subordinates;
        var employeeIndex = -1;
        for (var i = 0; i < toSubordinates.length; i++) {
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
    };
    EmployeeOrgApp.prototype.redo = function () {
        throw new Error('Redo feature is not implemented');
    };
    EmployeeOrgApp.prototype.findEmployee = function (manager, employeeID) {
        if (manager.uniqueId === employeeID) {
            return manager;
        }
        for (var _i = 0, _a = manager.subordinates; _i < _a.length; _i++) {
            var subordinate = _a[_i];
            var foundEmployee = this.findEmployee(subordinate, employeeID);
            if (foundEmployee) {
                return foundEmployee;
            }
        }
        return undefined;
    };
    EmployeeOrgApp.prototype.findSupervisor = function (manager, employeeID) {
        if (manager.subordinates.some(function (subordinate) { return subordinate.uniqueId === employeeID; })) {
            return manager;
        }
        for (var _i = 0, _a = manager.subordinates; _i < _a.length; _i++) {
            var subordinate = _a[_i];
            var foundSupervisor = this.findSupervisor(subordinate, employeeID);
            if (foundSupervisor) {
                return foundSupervisor;
            }
        }
        return undefined;
    };
    return EmployeeOrgApp;
}());
// Function to display the hierarchy
// Rest of your existing TypeScript code...
var ceo = {
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
var app = new EmployeeOrgApp(ceo);
// Function to display the hierarchy on the HTML page
function displayHierarchy(employee, indent) {
    if (indent === void 0) { indent = ' '; }
    var indentation = "".concat(indent, "  ");
    var employeeName = "".concat(indentation).concat(employee.uniqueId, " - ").concat(employee.name);
    document.getElementById('hierarchyOutput').textContent += employeeName + '\n';
    for (var _i = 0, _a = employee.subordinates; _i < _a.length; _i++) {
        var subordinate = _a[_i];
        displayHierarchy(subordinate, "".concat(indentation));
    }
}
// Function to clear the hierarchy output
function clearHierarchy() {
    document.getElementById('hierarchyOutput').textContent = '';
}
// Function to move an employee based on user input
function handleMove() {
    var employeeID = parseInt(document.getElementById('employeeID').value);
    var supervisorID = parseInt(document.getElementById('supervisorID').value);
    try {
        app.move(employeeID, supervisorID);
        clearHierarchy();
        displayHierarchy(ceo);
    }
    catch (error) {
        console.error(error);
    }
}
// Function to undo the last move action
function handleUndo() {
    try {
        app.undo();
        clearHierarchy();
        displayHierarchy(ceo);
    }
    catch (error) {
        console.error(error);
    }
}
// Function to redo the last undone action
function handleRedo() {
    try {
        app.redo();
        clearHierarchy();
        displayHierarchy(ceo);
    }
    catch (error) {
        console.error(error);
    }
}
// Add event listeners to the buttons
document.getElementById('moveButton').addEventListener('click', handleMove);
document.getElementById('undoButton').addEventListener('click', handleUndo);
document.getElementById('redoButton').addEventListener('click', handleRedo);
// Display the hierarchy on the HTML page
displayHierarchy(ceo);
// Create the employee hierarchy
// // Usage example
// displayHierarchy(ceo); //before changing Hierarchy
// app.move(7, 2); // Move Bob Saget to be subordinate of Cassandra Reynolds
// console.log("<------------------------------------------------------------------------------------->");
// // Display the hierarchy
// displayHierarchy(ceo);
// console.log("<------------------------------------------------------------------------------------->");
// app.undo(); // Undo the move action
// // Display the hierarchy again
// displayHierarchy(ceo);
// console.log("<------------------------------------------------------------------------------------->");
