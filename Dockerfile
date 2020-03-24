FROM node:12
MAINTAINER info@vizzuality.com

ENV NAME proxy-service
ENV USER proxy-service

RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
  gnupg \
  bash \
  build-essential \
  python && rm -rf /var/lib/apt/lists/*

# Add Chrome as a user
RUN groupadd -r $USER && useradd -r -g $USER -G audio,video $USER \
    && mkdir -p /home/$USER && chown -R $USER:$USER /home/$USER

RUN yarn global add grunt-cli bunyan

RUN mkdir -p /home/$NAME
COPY package.json /home/$NAME/package.json
COPY yarn.lock /home/$NAME/yarn.lock
RUN cd /home/$NAME && yarn

COPY entrypoint.sh /home/$USER/entrypoint.sh
COPY config /home/$USER/config

WORKDIR /home/$NAME

COPY ./app /home/$NAME/app
RUN chown -R $USER:$USER /home/$NAME

# Tell Docker we are going to use this ports
EXPOSE 5000
USER $USER

ENTRYPOINT ["./entrypoint.sh"]
