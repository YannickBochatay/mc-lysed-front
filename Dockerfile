# pull official base image
FROM node:alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json .

RUN apk update
RUN apk add git

RUN npm install 

# add app
COPY . .

# start app
CMD ["npm", "start"]
