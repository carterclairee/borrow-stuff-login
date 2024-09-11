## Setup

### Dependencies

- Run `npm install` in project directory. This will install server-related dependencies such as `express`.
- `cd client` and run `npm install`. This will install client dependencies (React).

### Database Prep

- Access the MySQL interface in your terminal by running `mysql -u root -p`
- Create a new database called mvp: `create database mvp`
- Add a `.env` file to the project folder of this repository containing the MySQL authentication information for MySQL user. For example:

```bash
  DB_HOST=localhost
  DB_USER=root
  DB_NAME=mvp
  DB_PASS=YOURPASSWORD
```

- Run `npm run migrate` in the project folder of this repository, in a new terminal window. This will create a table called 'students' in your database.

- Make sure you understand how the `People` and the `Items` table is constructed. In your MySQL console, you can run `use mvp;` and then `describe People;` `describe Items;`  to see the structure of the tables.

### Development

- Run `npm start` in project directory to start the Express server on port 4000
- In another terminal, do `cd client` and run `npm run dev` to start the client in development mode with hot reloading in port 5173.


Suggestion for People;

INSERT INTO People (first_name, last_name, floor, email) VALUES ("Diana", "Prince", 3, "diana.prince@mvp.com"), ("Kara", "Zor-El", 2, "kara.zor-el@mvp.com"), ("Jean", "Grey",7, "jean.grey@mvp.com"), ("Barbara", "Gordon", 8, "barbara.gordon@mvp.com"), ("Pamela", "Isley", 4, "pamela.isley@mvp.com");



Suggestion for Items;

INSERT INTO Items (item, free, belongs_to, borrowed_by)
VALUES ('camera', true, 1, NULL), ('laptop', true, 2, NULL), ('microphone', true, 3, NULL), ('tripod', true, 4, NULL), ('tablet', true, 5, NULL), ('headphones', true, 1, NULL), ('projector', true, 2, NULL), ('smartphone', false, 3, 1), ('speaker', false, 4, 2),('monitor', true, 5, NULL), ('keyboard', true, 1, NULL);