# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the working directory
# This allows npm install to run efficiently by leveraging Docker's layer caching
COPY package.json yarn.lock ./

RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your Node.js application listens on (e.g., 3000)
# This is optional but good practice for web applications
EXPOSE 3000

# Define the command to run your Node.js script
CMD ["node", "index.js"]
