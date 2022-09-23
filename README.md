[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


# Food Order Management System

The project is aimed to provide online lunch order management system for their employees.


## Appendix

[Introduction](https://github.com/AbdullahDev0/Food-Order-Management-System/edit/main/README.md#introduction)

[Features](https://github.com/AbdullahDev0/Food-Order-Management-System/edit/main/README.md#features)

[Installation](https://github.com/AbdullahDev0/Food-Order-Management-System/edit/main/README.md#installation)

[Future Features](https://github.com/AbdullahDev0/Food-Order-Management-System/edit/main/README.md#future-features)

[Feedback](https://github.com/AbdullahDev0/Food-Order-Management-System/edit/main/README.md#feedback)




## Introduction
The project provides RESTful APIs for order managements system.
It allows the users to place food orders and the office managerial
staff to easily process the orders and partially automate lunch
system. Since the project is in alpha stage so there might be some issues
that can cause server crash. The project API details are available through [Postman
documentation](https://documenter.getpostman.com/view/19499937/2s7YfR7sw6).


## Features

- Two roles, admin and users
- Dynamic food addition
- Multiple food orders with comments management
- Daily scheduled PDF email of placed orders (uses RabbitMQ)
## Installation

The project requires

- NEST JS
- RabbitMQ

To deploy this project, clone it by running following command in command prompt:

```bash
git clone https://github.com/AbdullahDev0/Food-Order-Management-System.git
```

Then install the required package by:

```bash
npm install
```    

To run the project alone without rabbit-mq, open command prompt in project cloned directory and type command:

```bash
npm run start
```    

To run the project alone with rabbit-mq, open command prompt in project cloned directory and type command:

```bash
npm run start:all
```

(Optional) In order to run the project in development mode, without rabbit-mq:

```bash
npm run start:dev
```

(Optional) In order to run the project in development mode, with rabbit-mq:

```bash
npm run dev:all
```

  
## Future Features

- Create unit and feature test cases
- Add admin control for schedule printing
- Create React JS based frontend
## Feedback
#### “Being critical isn’t the same as being disrespectful.”

#### ― A.D. Aliwat, In Limbo

If you have any feedback, please reach out to us at abdullahirfandev@gmail.com.
