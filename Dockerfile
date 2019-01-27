FROM node:8.11.1

# Create app directory
RUN mkdir -p /usr/src/vimond-api
WORKDIR /usr/src/vimond-api

# Install app dependencies
COPY package.json /usr/src/vimond-api
RUN npm install

# Bundle app source
COPY . /usr/src/vimond-api

# Build arguments
ARG NODE_VERSION=8.11.1

# Environment
ENV NODE_VERSION $NODE_VERSION