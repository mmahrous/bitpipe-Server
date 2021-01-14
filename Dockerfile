FROM node:14.15-alpine
RUN mkdir /app 
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT [ "node", "index.js" ]
