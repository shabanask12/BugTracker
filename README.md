# BugTracker
# BugTracker - A Role-Based Access Control (RBAC) Project


## 📖 Description

This is a full-stack bug tracking application designed to streamline the process of managing software issues. The project's core feature is a robust **Role-Based Access Control (RBAC)** system, which manages user permissions and ensures data security. The dynamic frontend is built with **React**, communicating with a secure, custom-built RESTful API powered by **PHP** and a **MySQL** database.

---

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Defines specific permissions for user roles such as **Admin**, **Developer**, and **Tester**.
* **User Authentication:** Secure user registration and login functionality.
* **Bug Reporting:** An intuitive interface for submitting new bugs with details like priority, description, and status.
* **Dynamic Dashboard:** A central dashboard to view, filter, and track the status of all bugs according to user permissions.

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** PHP
* **Database:** MySQL
* **Version Control:** Git & GitHub

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You will need the following software installed on your computer:
* [Node.js](https://nodejs.org/) (which includes npm)
* A local server environment like [XAMPP](https://www.apachefriends.org/) or [Laragon](https://laragon.org/) (to run PHP and MySQL)
* [Git](https://git-scm.com/)

### Installation

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/shabanask12/BugTracker.git](https://github.com/shabanask12/BugTracker.git)
    cd BugTracker
    ```

2.  **Backend Setup**
    * Start your Apache and MySQL services from your XAMPP or Laragon control panel.
    * Open phpMyAdmin and create a new database (e.g., `bugtracker_db`).
    * Import the `bug.sql` file into the new database to create the necessary tables.
    * Ensure your PHP database connection files point to this new database with the correct credentials.

3.  **Frontend Setup**
    * Navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    * Install the required npm packages:
        ```sh
        npm install
        ```
    * Start the React development server:
        ```sh
        npm start
        ```

Your React app should now be running on `http://localhost:3000` and connected to your local backend.

---

## 📄 License

This project is licensed under the MIT License.
