# Employee Organization Hierarchy App

This is a TypeScript-based application that allows you to manage an employee organization hierarchy. You can move employees between supervisors, undo and redo actions, and view the organization hierarchy in real-time.

The live app is deployed at: `https://manufacorganizationhierarchy.netlify.app/`

## How to Build and Use the Application

### Prerequisites

- Ensure you have Node.js installed on your machine.

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Run the following command to install the required dependencies:

   ```shell
   npm install
   ```
## Usage and Functionality

To build and use the application, follow these steps:

1. Compile the TypeScript files and generate the necessary JavaScript file by running the following command:

   ```shell
   tsc index.ts
   node index.js //to run js file (if required)
    ```
2. Open the `index.html` file in your preferred web browser to use the application.

3. The application provides the following features:

    - **Organization Hierarchy Display**: The hierarchy of employees will be displayed on the page, showing the unique IDs and names of each employee and their subordinates.

    - **Move Employee**: To move an employee, enter the employee ID and the supervisor ID in the input fields provided. Click the "Move" button to execute the move action. The organization hierarchy will be updated accordingly.

    - **Undo**: To undo the last move action, click the "Undo" button. The hierarchy will revert to the previous state.

    - **Redo**: If an undo action has been performed, the "Redo" button will be enabled. Click it to redo the last undone action.

4. Explore the application by moving employees, undoing and redoing actions, and observing the updated hierarchy display.

## Live Deployment

The live version of the Employee Organization Hierarchy App can be accessed at [https://manufacorganizationhierarchy.netlify.app/](https://manufacorganizationhierarchy.netlify.app/). Feel free to visit the link to interact with the application without having to build it locally.


