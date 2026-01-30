FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies (including dev for ng serve)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

EXPOSE 4201

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4201"]
