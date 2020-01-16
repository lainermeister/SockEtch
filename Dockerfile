# FROM node:10.16.3
# # set working directory
# WORKDIR /app
# # add `/app/node_modules/.bin` to $PATH
# # install and cache app dependencies
# COPY package.json ./
# RUN npm install --silent
# ADD . .
# RUN npm run build
# EXPOSE 8080
# # start app
# CMD ["npm", "start"]