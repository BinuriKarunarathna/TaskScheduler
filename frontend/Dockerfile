# Use Node.js LTS
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose React frontend port
EXPOSE 3000

# Start frontend
CMD ["npm", "start"]
