# Use Node.js 20
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon

# Copy backend code
COPY . .

# Expose port
EXPOSE 5000

# Command for hot reload
CMD ["npx", "nodemon", "server.js"]
