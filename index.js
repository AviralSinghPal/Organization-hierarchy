function cloneEmployeeHierarchy(employee) {
    var clonedEmployee = {
        uniqueId: employee.uniqueId,
        name: employee.name,
        subordinates: [],
    };
    for (var _i = 0, _a = employee.subordinates; _i < _a.length; _i++) {
        var subordinate = _a[_i];
        var clonedSubordinate = cloneEmployeeHierarchy(subordinate);
        clonedEmployee.subordinates.push(clonedSubordinate);
    }
    return clonedEmployee;
}
var EmployeeOrgApp = /** @class */ (function () {
    function EmployeeOrgApp(ceo) {
        this.ceo = ceo;
        this.history = [cloneEmployeeHierarchy(ceo)];
        this.currentIndex = 0;
    }
    EmployeeOrgApp.prototype.move = function (employeeID, supervisorID) {
        var employee = this.findEmployee(this.ceo, employeeID);
        var fromSupervisor = this.findSupervisor(this.ceo, employeeID);
        var toSupervisor = this.findEmployee(this.ceo, supervisorID);
        if (!employee || !fromSupervisor || !toSupervisor) {
            throw new Error("Invalid employee or supervisor ID");
        }
        var historyCopy = cloneEmployeeHierarchy(this.history[this.currentIndex]);
        this.history.splice(this.currentIndex + 1);
        this.history.push(historyCopy);
        this.currentIndex = this.history.length - 1;
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
            var movedEmployee = fromSubordinates.splice(employeeIndex, 1)[0];
            movedEmployee.subordinates.forEach(function (subordinate) {
                fromSupervisor.subordinates.push(subordinate);
            });
            movedEmployee.subordinates.length = 0;
        }
        // Add employee to new supervisor's subordinates
        toSupervisor.subordinates.push(employee);
    };
    EmployeeOrgApp.prototype.undo = function () {
        if (this.currentIndex <= 0) {
            throw new Error("No actions to undo");
        }
        var currentHierarchy = this.history[this.currentIndex];
        var previousHierarchy = this.history[this.currentIndex - 1];
        // Find the differences between the current and previous hierarchy
        var differences = this.findHierarchyDifferences(currentHierarchy, previousHierarchy);
        // Move the employees back to their previous supervisors
        for (var _i = 0, differences_1 = differences; _i < differences_1.length; _i++) {
            var difference = differences_1[_i];
            var employeeID = difference.employeeID, previousSupervisorID = difference.previousSupervisorID;
            this.move(employeeID, previousSupervisorID);
        }
        this.currentIndex--;
        this.ceo = cloneEmployeeHierarchy(previousHierarchy);
        clearHierarchy();
        displayHierarchy(this.ceo);
    };
    EmployeeOrgApp.prototype.redo = function () {
        if (this.currentIndex >= this.history.length - 1) {
            throw new Error("No actions to redo");
        }
        this.currentIndex++;
        this.ceo = cloneEmployeeHierarchy(this.history[this.currentIndex]);
        clearHierarchy();
        displayHierarchy(this.ceo);
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
    EmployeeOrgApp.prototype.findHierarchyDifferences = function (currentHierarchy, previousHierarchy) {
        var differences = [];
        this.findEmployeeDifferences(currentHierarchy, previousHierarchy, differences);
        return differences;
    };
    EmployeeOrgApp.prototype.findEmployeeDifferences = function (currentEmployee, previousEmployee, differences, previousSupervisorID) {
        if (currentEmployee.uniqueId !== previousEmployee.uniqueId || currentEmployee.subordinates.length !== previousEmployee.subordinates.length || previousSupervisorID !== undefined) {
            differences.push({
                employeeID: currentEmployee.uniqueId,
                previousSupervisorID: previousSupervisorID !== undefined ? previousSupervisorID : currentEmployee.uniqueId,
            });
        }
        for (var i = 0; i < currentEmployee.subordinates.length; i++) {
            var currentSubordinate = currentEmployee.subordinates[i];
            var previousSubordinate = previousEmployee.subordinates[i];
            this.findEmployeeDifferences(currentSubordinate, previousSubordinate, differences, previousEmployee.uniqueId);
        }
    };
    return EmployeeOrgApp;
}());
// Function to display the hierarchy
var ceo = {
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
var app = new EmployeeOrgApp(ceo);
// Function to display the hierarchy on the HTML page
function displayHierarchy(employee, indent) {
    if (indent === void 0) { indent = " "; }
    var indentation = "".concat(indent, "  ");
    var employeeName = "".concat(indentation, "(").concat(employee.uniqueId, ")").concat(employee.name);
    document.getElementById("hierarchyOutput").textContent += employeeName + "\n";
    for (var _i = 0, _a = employee.subordinates; _i < _a.length; _i++) {
        var subordinate = _a[_i];
        displayHierarchy(subordinate, "".concat(indentation));
    }
}
// Function to clear the hierarchy output
function clearHierarchy() {
    document.getElementById("hierarchyOutput").textContent = "";
}
// Function to move an employee based on user input
function handleMove() {
    var employeeID = parseInt(document.getElementById("employeeID").value);
    var supervisorID = parseInt(document.getElementById("supervisorID").value);
    try {
        app.move(employeeID, supervisorID);
        clearHierarchy();
        displayHierarchy(ceo);
    }
    catch (error) {
        document.getElementById("errorMessage").textContent = error.message;
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
document.getElementById("moveButton").addEventListener("click", handleMove);
document.getElementById("undoButton").addEventListener("click", handleUndo);
document.getElementById("redoButton").addEventListener("click", handleRedo);
displayHierarchy(ceo);
