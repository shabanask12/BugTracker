<img width="1908" height="1084" alt="image" src="https://github.com/user-attachments/assets/9b2ff736-e539-4d90-8fe7-fe7c21bdae39" />
<img width="1917" height="1092" alt="image" src="https://github.com/user-attachments/assets/c0e40916-122a-4197-9713-2e6b3d37e32f" />

<img width="1915" height="1095" alt="image" src="https://github.com/user-attachments/assets/a76c0286-874d-4f6a-9621-f587f87ee09f" />
<img width="1912" height="1083" alt="image" src="https://github.com/user-attachments/assets/42efecaa-7024-4ab2-b858-a772c05eefa1" />
<img width="1916" height="1099" alt="image" src="https://github.com/user-attachments/assets/5ce22cd7-2e22-44af-a2f9-84151b4e6e92" />
<img width="1913" height="1093" alt="image" src="https://github.com/user-attachments/assets/187c19e0-3496-4862-ac9e-cf9c6f41c59e" />
<img width="1919" height="1091" alt="image" src="https://github.com/user-attachments/assets/4efb94a1-8026-4302-8b84-5944b0a95c96" />
<img width="1919" height="1094" alt="image" src="https://github.com/user-attachments/assets/4911a3a0-6bab-4c25-998a-191290896bd0" />
<img width="1911" height="1067" alt="image" src="https://github.com/user-attachments/assets/aabe1ed3-b672-44af-9ea6-a3368550ff32" />







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

