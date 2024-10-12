
# Library Management System

#### **Project Overview**:
The **Library Management System** is a RESTful API built with Node.js and MySQL for managing books, borrowers, and the borrowing process in a library. It allows users to add books, register borrowers, and track borrowing activities. The system ensures basic authentication for certain endpoints and includes additional features like overdue book tracking and CSV export functionality. The project is fully containerized using Docker for easy deployment.

#### **Key Features**:
1. **Books Management**:
   - Add a book with details like title, author, ISBN, available quantity, and shelf location.
   - Update or delete a book.
   - List all books or search for a book by title, author, or ISBN.

2. **Borrowers Management**:
   - Register a borrower with details like name, email, and registered date.
   - Update or delete a borrower.
   - List all registered borrowers.

3. **Borrowing Process**:
   - A borrower can borrow a book, and the system keeps track of the borrowed book and due dates.
   - A borrower can return a book, updating the book’s availability in the system.
   - Track the books currently borrowed by a borrower.
   - List overdue books (books not returned by their due date).

4. **CSV Export**:
   - Export borrowing processes in CSV format.
   - Export overdue books data from the last month.

5. **Authentication**:
   - Basic authentication using username `admin` and password `let.me.in` to protect specific API routes.

6. **Rate Limiting**:
   - Prevent API abuse by limiting certain endpoints (e.g., POST requests for adding books and borrowers) to 3 requests per 6 seconds.

7. **Dockerized**:
   - The entire application is containerized using Docker with a MySQL database running in a separate container.
   - Running the project with `docker-compose` automatically sets up the containers for the Node.js app and MySQL database.

#### **Technologies Used**:
- **Node.js**: Server-side JavaScript runtime for building the application.
- **Express.js**: Web framework for building the RESTful API.
- **Sequelize**: ORM for connecting and interacting with MySQL.
- **MySQL**: Relational database for storing books, borrowers, and borrowing records.
- **Docker**: Containerization tool for easy deployment of the Node.js application and MySQL database.
- **Express-Rate-Limit**: Middleware for implementing rate limiting on certain API endpoints.
- **Basic-Auth**: Middleware for securing specific API routes with username/password authentication.
- **Moment.js**: Library for handling dates, particularly for calculating due dates and exporting records from a specific time range.
- **json2csv**: Library for exporting data to CSV format.
- **Jest**: Testing framework for writing and running unit tests.

#### **Installation & Setup**:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/library-management-system.git
   cd library-management-system
   ```

2. **Environment Variables**:
   Create a `.env` file in the project’s root directory with the following content:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=library_management
   DB_DIALECT=mysql
   ```

3. **Run the Application Locally** (Without Docker):
   - Install the necessary dependencies:
     ```bash
     npm install
     ```
   - Make sure MySQL is installed and running on your machine.
   - Create an empty database called 'library_management'.
   - Run the migrations to set up the database tables:
     ```bash
     npx sequelize-cli db:migrate
     ```
   - Start the application:
     ```bash
     nodemon app.js
     ```

4. **Running the Application with Docker**:
   - If Docker is installed, use the following command to build and run the app and database containers:
     ```bash
     docker-compose up --build
     ```
   - This will set up the app and MySQL database in separate containers.
   - **Note**: Migrations will automatically run when Docker starts up.

5. **Testing the Application**:
   - **With Postman**:
     - You can test the following API endpoints using Postman framework:
     - **Books API**:
       - `POST /books`: Add a new book.
       - `PUT /books/:id`: Update book details.
       - `DELETE /books/:id`: Delete a book.
       - `GET /books`: List all books.
       - `GET /books/search`: Search books by title, author, or ISBN.
     - **Borrowers API**:
       - `POST /borrowers`: Register a new borrower.
       - `PUT /borrowers/:id`: Update borrower details.
       - `DELETE /borrowers/:id`: Delete a borrower.
       - `GET /borrowers`: List all borrowers.
     - **Borrowing Process API**:
       - `POST /borrows`: Borrow a book.
       - `PUT /returns/:borrow_id`: Return a book.
       - `GET /borrows/:borrower_id`: List books borrowed by a specific borrower.
       - `GET /overdue`: List overdue books.
       - **Bonus**:
         - `GET /export-csv`: Export borrowing processes to CSV.
         - `GET /export-overdue-csv`: Export overdue borrows of the last month to CSV.

#### **Key Concepts Implemented**:
- **Sequelize ORM**: Mapping models (Books, Borrowers, Borrows) to MySQL tables with relationships (One-to-Many, Many-to-One).
- **CRUD Operations**: Complete implementation of Create, Read, Update, and Delete operations for Books and Borrowers.
- **API Security**: Basic authentication to protect certain routes.
- **Error Handling**: Proper error handling for edge cases, such as trying to borrow an unavailable book or entering invalid data.
- **CSV Export**: Export of borrowing and overdue data in CSV format.
- **Rate Limiting**: API rate limiting to prevent abuse by limiting the number of requests per time frame.
- **Dockerized Setup**: Full containerization using Docker and Docker Compose for easy deployment.

#### **Project Workflow Summary**:

- **Step 1**: Setup and initialization with Node.js and MySQL.
- **Step 2**: Database schema and Sequelize models (Books, Borrowers, Borrows).
- **Step 3**: RESTful API endpoints for Books, Borrowers, and Borrowing processes.
- **Step 4**: API testing with Postman for all CRUD and borrowing operations.
- **Step 5**: Added security features (Basic Authentication and rate limiting).
- **Step 6**: CSV export of borrowing processes and overdue books.
- **Step 7**: Dockerization of the app and MySQL for containerized deployment.

#### **Future Enhancements**:
- Implement JWT-based authentication for more secure access.
- Add a feature for book reservations or reviews.
- Extend the reporting functionality to generate analytical reports of library usage over time.

