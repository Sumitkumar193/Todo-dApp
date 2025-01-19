# Todo-dApp
Decentralized todo application built in Node.js and React.

## Overview
This project is a decentralized todo application that leverages blockchain technology to manage tasks. The backend is built with Node.js and TypeScript, while the frontend is built with React and Next.js. The smart contract is deployed on the Sepolia Ethereum network.

## Smart Contract
The smart contract is deployed on the Sepolia Ethereum network with the address `0xb34354F5378779d9Ec2151A8115D6a6Df4785534`.
Application Binary Interface (ABI) is available in the `backend/src/blockchain/build/contracts` directory.

## Features
- Create, update, and retrieve todo items.
- Real-time updates with Socket.io.
- Secure authentication with JWT.
- Input validation with Joi.
- Type-safe development with TypeScript.

## Endpoints

### Backend Endpoints
- `POST /api/todos`: Create a new todo item.
- `GET /api/todos`: Retrieve all todo items.
- `GET /api/todos/:id`: Retrieve a specific todo item by ID.
- `PUT /api/todos/:id`: Update a specific todo item by ID.
- `POST /api/auth/login`: User login.
- `POST /api/auth/register`: User signup.

### Frontend Routes
- `/`: Home page displaying the list of todos.
- `/todo/:id`: Detailed view of a specific todo item.

## Dependencies

### Backend Dependencies
- `express`: Web framework for Node.js.
- `jsonwebtoken`: For JWT authentication.
- `joi`: For input validation.
- `dotenv`: For environment variable management.
- `helmet`: For securing HTTP headers.
- `morgan`: HTTP request logger.
- `p-limit`: For limiting concurrent operations.

### Backend Dev Dependencies
- `typescript`: TypeScript language support.
- `ts-node`: TypeScript execution environment.
- `nodemon`: For automatic server restarts during development.
- `eslint`: For linting TypeScript code.
- `prettier`: For code formatting.
- `@types/*`: TypeScript type definitions for various packages.

### Frontend Dependencies
- `react`: JavaScript library for building user interfaces.
- `next`: React framework for server-side rendering.
- `axios`: For making HTTP requests.
- `tailwindcss`: Utility-first CSS framework.

### Frontend Dev Dependencies
- `typescript`: TypeScript language support.
- `eslint`: For linting TypeScript code.
- `prettier`: For code formatting.
- `postcss`: For transforming CSS with JavaScript plugins.

## Getting Started

### Prerequisites
- Node.js (version 14 or later)
- npm (version 6 or later) or Yarn

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/todo-dapp.git
   cd todo-dapp
    ```
2. Install the dependencies:
    ```sh
    cd backend && npm install
    cd frontend && npm install
    ```
3. Create a `.env` file in the `backend` directory with the following environment variables:
    ```sh
    cp .env.example .env
    ```
4. Set up the database and generate the Prisma client:
    ```sh
    cd backend && npx prisma migrate dev
    cd backend && npx generate
    ```
### Running the project
1. Start the backend server:
    ```sh
    cd backend && npm run dev
    ```
2. Start the frontend server:
    ```sh
    cd frontend && npm run dev
    ```
3. Open your browser and navigate to `http://localhost:3000` to view the application.

### Building the project
1. Build the frontend application:
    ```sh
    cd frontend && npm run build
    ```
2. Build the backend application:
    ```sh
    cd backend && npm run build
    ```
3. Start the production server:
    ```sh
    cd backend && npm start
    ```
### Setting up the smart contract
1. Install the Truffle CLI:
    ```sh
    npm install -g truffle
    ```
2. Compile the smart contract:
    ```sh
    cd backend && truffle compile
    ```
3. Deploy the smart contract:
    ```sh
    # To deploy the smart contract on the Sepolia network PRIVATE_KEY in .env file should be set
    cd backend && truffle migrate --network sepolia
    ```

### Author
- [Sumit Kumar](https://github.com/Sumitkumar193)

### Contact
- For any queries, feel free to reach out to [itsme.sumit96@gmail.com](mailto:itsme.sumit96@gmail.com).