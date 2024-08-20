Todo List React App
A feature-rich Todo List application built with React, featuring user authentication, task management with categories and priorities, and progress tracking.
Features

User authentication (login and registration)
Create, read, update, and delete tasks
Assign priorities and categories to tasks
Filter tasks by category and sort by priority or due date
Track daily and weekly progress
Responsive design using Tailwind CSS

Technologies Used

React
React Router for navigation
Axios for API requests
Tailwind CSS for styling
React-toastify for notifications
Docker for containerization

Prerequisites

Node.js (v14 or later)
npm (v6 or later)
Docker (optional, for containerized setup)

Installation and Setup
Local Setup

Clone the repository:
Copygit clone https://github.com/yourusername/todo-list-frontend.git
cd todo-list-frontend

Install dependencies:
Copynpm install

Create a .env file in the root directory and add the following:
CopyREACT_APP_API_URL=http://localhost:3000

Start the development server:
Copynpm start

Open http://localhost:3000 in your browser.

Docker Setup

Make sure you have Docker and Docker Compose installed on your system.
Build and run the Docker container:
Copydocker-compose up --build

Open http://localhost:3000 in your browser.

Usage

Register a new account or log in with existing credentials.
Once logged in, you'll be redirected to the dashboard.
Create new tasks by filling out the form at the bottom of the task list.
Manage your tasks:

Mark tasks as complete
Edit task details
Delete tasks


Create and manage categories for better task organization.
Use the filter and sort options to organize your task view.
Track your progress with the daily and weekly progress bars.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License.