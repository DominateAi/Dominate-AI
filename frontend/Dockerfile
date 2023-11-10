FROM nginx:1.12-alpine
LABEL maintainer="GauravSharma"
LABEL imagetype="DomiateLangingPage"
COPY  ./build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443