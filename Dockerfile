FROM --platform=linux/amd64 node:8.12.0

# Update and install nginx
RUN apt-get update && apt-get upgrade -y && apt-get install nginx -y

# DNS cache
RUN apt-get install -y nscd && rm -rf /var/lib/apt/lists/*
RUN touch /etc/netgroup

ADD nginx/default.conf /etc/nginx/nginx.conf
ADD nginx/custom_settings.conf /etc/nginx/custom_settings.conf

RUN wget http://security.debian.org/debian-security/pool/updates/main/c/ca-certificates/ca-certificates_20200601~deb9u2_all.deb && dpkg -i ca-certificates_20200601~deb9u2_all.deb
RUN update-ca-certificates

COPY . /app
WORKDIR /app

RUN npm cache clean --force && npm install
RUN npm install natives@1.1.6
RUN npm install pm2@4.2.1 -g

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
ENV PORT 3333
ENV HOST 0.0.0.0

EXPOSE 80

CMD service nginx start && pm2 start npm --no-daemon -- run serve
