FROM --platform=linux/amd64 node:lts as build
RUN mkdir -p /usr/build
WORKDIR /usr/build
COPY . .
RUN yarn install --ignore-platform
RUN yarn build

FROM keymetrics/pm2:16-alpine
ARG PORT=3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=build /usr/build /usr/src/app
EXPOSE $PORT
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]