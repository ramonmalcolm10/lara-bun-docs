FROM composer:latest AS vendor

COPY ./composer.json /app/
COPY ./composer.lock /app/

RUN composer install --no-dev --no-autoloader --no-scripts --ignore-platform-reqs

COPY . /app

RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs


FROM oven/bun:alpine AS js

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY --from=vendor /app/ /app

RUN bun run build:rsc


FROM dunglas/frankenphp:1.11.3-php8.5-alpine

#RUN install-php-extensions pcntl sockets pdo_sqlite opcache

COPY --from=oven/bun:alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY --chown=www-data --from=js /app/ /app

ENV NODE_ENV=production


RUN mkdir -p /data/caddy /config/caddy \
    && chown -R www-data:www-data /data /config /app/storage /app/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER www-data

ENTRYPOINT ["docker-entrypoint.sh"]
