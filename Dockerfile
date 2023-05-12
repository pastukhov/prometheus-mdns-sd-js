# FROM node as test

# WORKDIR /app

# COPY package.json .
# RUN yarn install && yarn add --dev jest

# COPY *.js .

# RUN yarn test

FROM node as runtime

WORKDIR /app

COPY package.json .
RUN yarn install

COPY *.js .

ENTRYPOINT ["node"]
CMD ["/app/index.js"]
