FROM node:6

# Create sentimeter directory
RUN mkdir /water-api
WORKDIR /water-api

# Variables
ENV NODE_ENV production
ENV LOGGING false

# Install
COPY . /water-api

RUN npm install .

EXPOSE 8080
CMD ["node", "index.js"]
