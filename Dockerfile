FROM node:latest

COPY . /opt/

RUN cd /opt && npm install

WORKDIR /opt

CMD ["npm", "run", "test"]
