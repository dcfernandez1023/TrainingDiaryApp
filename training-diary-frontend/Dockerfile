FROM node:16-alpine3.11

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

# install app dependencies
COPY package*.json ./
RUN npm install

# add app
COPY . .

EXPOSE 3000

# start app
CMD ["npm", "start"]
