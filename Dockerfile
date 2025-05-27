FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /app
RUN chmod 755 /app/src/database/prisma/dev.db

RUN npx prisma migrate dev

USER node

EXPOSE 3000

CMD ["npm", "run", "build"]