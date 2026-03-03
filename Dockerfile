FROM composer:latest AS vendor

COPY ./composer.json /app/
COPY ./composer.lock /app/

RUN composer install --no-dev --no-autoloader --no-scripts --ignore-platform-reqs

COPY . /app

RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs


FROM dunglas/frankenphp:1.11.3-php8.5-alpine

RUN install-php-extensions pcntl sockets

COPY --from=oven/bun:alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY --chown=www-data --from=vendor /app/ /app

RUN bun install --frozen-lockfile

ENV NODE_ENV=production
ENV BUN_RSC_ENABLED=true
ENV BUN_BRIDGE_SOCKET=/tmp/larabun-docs-bridge.sock

RUN APP_KEY=base64:dGhpcy1pcy1hLWR1bW15LWtleS1mb3ItYnVpbGQtb25seQ== php artisan rsc:build --clean

RUN rm -f /tmp/larabun-docs-bridge.sock

RUN mkdir -p /data/caddy /config/caddy \
    && chown -R www-data:www-data /data /config /app/storage /app/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER www-data

ENTRYPOINT ["docker-entrypoint.sh"]
