FROM node:10.16.3
WORKDIR /app
ADD ./ ./
RUN npm install --silent
EXPOSE 8080
CMD ["npm", "start"]