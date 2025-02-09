# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory for all build stages
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies including development ones
RUN npm install --ignore-scripts

# Copy source code and Proto files
COPY . .
COPY src/protos ./src/protos

# Run the TypeScript compilation
RUN npm install --only=production
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production
# Setting both ports - one for gRPC and one for Kafka communication
ENV PORT=3006
ENV ADMIN_GRPC_PORT=5006

# Install only production dependencies
COPY package*.json ./   
RUN npm install --omit=dev --ignore-scripts

# Copy compiled JavaScript and Proto files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/protos ./dist/protos

# Set proper permissions and user for security
RUN chown -R node:node /usr/src/app
USER node

# Expose both ports - gRPC and Kafka
EXPOSE ${PORT}
EXPOSE ${ADMIN_GRPC_PORT}

CMD ["node", "dist/Server.js"]