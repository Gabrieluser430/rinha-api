FROM node:21.6.0

WORKDIR /home/gcc/rinha

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]