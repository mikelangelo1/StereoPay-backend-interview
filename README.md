
## Overview
This is the server-side application for Stereopay Backend Interview (developed using NestJS)

## Development

### Prerequisites

- VS Code
  - Other IDEs might work too, but VS Code is preferred just so everyone on the team is using the same tools
- Install NodeJS (v14.19.0)
  - [Recommended] It is preferred to install and use `nvm` to manage multiple node versions if you already have a different node version installed
    - For Windows: https://github.com/coreybutler/nvm-windows
    - For Mac & Linux: https://github.com/nvm-sh/nvm
  - If for some reason, you choose not to use 'nvm', you can also install the specified version of NodeJS directly from [here](https://nodejs.org/download/release/v14.19.0/)
    - Note: This approach might cause conflicts if you have a different version of NodeJS already installed on your machine
- Learn about Nest JS
  - We use Nest JS as our NodeJS server-side Framework. It has full TypeScript support, and has a very opinionated way of doing thing. As such, please go through the key concepts of NestJS before diving into this project
  - More info on NestJS can be found [here](https://docs.nestjs.com/)
- Learn about Prisma
  - We use Prisma as our ORM while accessing the DB through code. Prisma takes a very different approach to ORM than others like TypeORM and Sequelize. As such, please go through the key concepts of Prisma before diving into this project
  - Learn more about how Prisma works [here](https://www.prisma.io/docs/getting-started)


### Setup


- Setup `.env` file
  - Create a file called `.env` at the root of the project
    - The server requires the `.env` file to be present, and to contain the keys and secrets required. But since it can contain secrets, this file is not pushed to git. That's why we must create it after we clone the repo.
  - Update the `.env` file
    - Replace the connection string in the `DATABASE_URL` with the proper values for your MYSQL DB

### Running the app

- Open the workspace in VS Code
  - Make sure to open the workspace, and not just the folder
- Open terminal, and navigate to the project directory `'<repo_path>/server'`
- Run `npm install`
- Run `npm run start:dev`
  - This will start running the Stereopay media server on port 5000
  - This will also start running the Swagger UI with the OpenAPI spec at http://localhost:5000/openapi
    - You can use it to review the API spec, and also to send requests to the server without using Postman
  - If you choose to use Postman, you can find the Stereopay Collection and Documentation [here](https://documenter.getpostman.com/view/8655337/2s93JzMg9N)


### Changing the DB schema
We use Prisma as our ORM, and as such we need to regenerate the prsima client everytime we make a change. We use Prisma's migration tool for this. Generally, this is what it looks like:

- Update the schema in `prisma/schema.prisma`
- Run `npx prisma migrate dev --name name_for_the_migration`

That's it! Your local DB should now have the new changes, and it should have also regenerated the prsima client to use in code.

But in some cases, there could be conflict, or we might have to make a few more changes. More info on Prisma and it's Migration tool can be found [here](https://www.prisma.io/docs/concepts/components/prisma-migrate)

