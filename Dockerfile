FROM node:7

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

# build travis.sh using travis-build
#FROM quay.io/travisci/travis-ruby
#COPY travis.sh /home/travis/travis.sh
#RUN chmod a+rx /home/travis/travis.sh
#USER travis
#RUN (cd ~; bash ./travis.sh)
