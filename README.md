# Borrow Stuff
A full stack app to help community members share and keep track of items, now with a login feature. 

## See Borrow Stuff in Action
[Watch the video on Loom](https://www.loom.com/share/22c53f4a6db24bb9b0f3cbe839915fdf?sid=a49bea5b-c76f-4e72-9ced-ea1c61400655)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Techologies Used](#technologies-used)
4. [Installation](#installation)
5. [My Contributions](#my-contributions)
6. [Screenshots](#screenshots)
7. [Future Features](#future-features)

## Overview
Borrow Stuff is a full stack app that helps housemates share items. The most cost-effective and environmentally friendly choice is an item you or a friend already have! Borrow Stuff is set up as a house, but could be used for any community. Think neighbors, friends, coworkers; any community could work. Borrow Stuff was thought up by Emelie Gustafsson, and I increased the security and user experience by adding a login feature and user customization.

## Features
- User authentication
- Add and keep track of own items available to lend
- See items available to borrow from other community members
- Search items to borrow
- Track who has borrowed what item for easier return process

## Technologies Used
- Front end: React, CSS, Bootstrap
- Back end: Node.js, Express
- Database: MySQL
- Other tools: Git, GitHub, Postman, Vite

## Installation
1. Clone the repository:  
  `git clone https://github.com/your-username/borrow-stuff-login`

2. Navigate to the project directory:  
  `cd borrow-stuff-login`

3. Install server-related dependences, such as Express:  
  `npm install`

4. Install front end dependencies, such as React, on the client side:  
  `cd client`  
  `npm install`

5. Set up the database
    - Access the MySQL interface:  
    **Mac users:** In your terminal, enter `mysql -u root -p`  
    **PC users:** Search MySQL Command Line Client

    - Create a new database:  
    `create database mvp`
  
    - Add a `.env` file to the project folder of this repository containing your MySQL authentication information and a super secret password for use in the guard. For example:  
      ```bash
      DB_HOST=localhost
      DB_USER=root
      DB_NAME=mvp
      DB_PASS=YOURPASSWORDHERE
      SUPER_SECRET=SOMEPASSWORDHERE
      ```
    - Migrate the database and create the tables in the main folder of the repository:  
    `cd ..` (if still in the client folder)  
    `npm run migrate`

6. If you'd like to start the database with some data, open MySQL and use or revise the following:

    **People**  
    ```sql
    INSERT INTO People (first_name, last_name, floor, email VALUES ("Diana", "Prince", 3, "diana.prince@mvp.com"), ("Kara", "Zor-El", 2, "kara.zor-el@mvp.com"), ("Jean", "Grey",7, "jean.grey@mvp.com"), ("Barbara", "Gordon", 8, "barbara.gordon@mvp.com"), ("Pamela", "Isley", 4, "pamela.isley@mvp.com");
    ```
    
    **Items**
    ```sql
    INSERT INTO Items (item, free, belongs_to, borrowed_by)VALUES ('camera', true, 1, NULL), ('laptop', true, 2, NULL), ('microphone', true, 3, NULL), ('tripod', true, 4, NULL), ('tablet', true, 5, NULL), ('headphones', true, 1, NULL), ('projector', true, 2, NULL), ('smartphone', false, 3, 1), ('speaker', false, 4, 2),('monitor', true, 5, NULL), ('keyboard', true, 1, NULL);
    ```

7. Start the Express servier on port 4000:  
`npm start`

8. Express needs that terminal to run. Open a new terminal to start the client in port 5173:  
  `cd client`  
  `npm run dev`  
  Click on the link or copy and paste it into your browser, and you can use the app!

## My Contributions
Emelie Gustafsson developed the idea for the app and its borrowing functionality. My contributions were:
- Creating a hashed password system
- Developing guards for endpoints to protect data
- Tailoring data shown on the front end for each user
- Revising endpoints so borrowing functionality is dependent on the user doing the borrowing
- Adding display of all items available to borrow
- Styling with Bootstrap

## Screenshots
### Login
![Login page view](/readmeassets/Login-Page.png "Login")
### Home Page
![Home page view](/readmeassets/Home-Page.png "Home Page")
### My Items
![I have view](/readmeassets/I-Have.png "I have")
### Items to Borrow
![I need view](/readmeassets/I-Need.png "I need")
### Return Items
![I return view](/readmeassets/I-Return.png "I return")

## Future Features
- Reminders users to return items
- Date borrowed display
- Forgot password feature
- Feature to put a request out to community for an item not already in the database