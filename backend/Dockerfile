# Use the official Node.js runtime as a parent image
FROM node:20-alpine

# Install Python and build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the database file if it doesn't exist
RUN touch todos.db

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["npm", "start"]
