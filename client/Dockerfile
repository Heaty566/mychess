FROM node:12-alpine
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app
# Installing dependencies

COPY package*.json ./
RUN yarn global add cross-env
RUN yarn install
# Copying source files
COPY . .
# Building app
RUN yarn run build
# Running the app
CMD [ "yarn", "start" ]