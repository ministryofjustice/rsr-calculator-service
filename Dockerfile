FROM node:8.10

# Create app directory
RUN mkdir -p /app
WORKDIR /app
ADD . .

ENV PORT=3000
ENV NODE_ENV=production

RUN npm install

EXPOSE 3000
CMD [ "node", "server.js" ]
