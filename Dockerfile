# Using an official Node.js image as the base image
FROM node:14

# Setting the working directory inside the container
WORKDIR /app

# Copying package.json and package-lock.json to the working directory
COPY package*.json ./

# Installing app dependencies
RUN npm install

# Copying the rest of your application's source code to the working directory
COPY . .

# Exposing the port your app runs on
EXPOSE 3000

# Run migrations automatically and start the app
CMD sh -c "npx sequelize-cli db:migrate && npm start"