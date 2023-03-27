FROM hub-dev.hexin.cn/b2cweb/node:v8.9
COPY ./ /var/www/trader-esoterica-front
COPY ./readiness.sh /opt/readiness.sh
COPY ./.builddep/prod/nginx/ /usr/local/openresty/nginx/conf/

ENV CODEPATH='/var/www/trader-esoterica-front'
EXPOSE 80
