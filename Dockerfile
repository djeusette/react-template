FROM node:5.7-slim

ENV HOME /home/app
WORKDIR $HOME

RUN chown -R nobody:nogroup $HOME
USER nobody

ADD . $HOME

EXPOSE 3000
EXPOSE 3001
EXPOSE 5000

CMD ["npm", "start"]
