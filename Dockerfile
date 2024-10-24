FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV EWELINK_ACCOUNT=
ENV EWELINK_PASSWORD=
ENV EWELINK_AREA=

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY --from=builder  /usr/src/app/dist ./

RUN ls -la 

VOLUME [ "/data" ]

EXPOSE 8080

CMD ["node", "index.js"]
