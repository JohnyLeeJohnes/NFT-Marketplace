FROM node:16 as dev-deps

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install

FROM node:16 as prod-deps

WORKDIR /opt/app

RUN curl -sf https://gobinaries.com/tj/node-prune | sh
COPY package.json package-lock.json ./
RUN \
	npm install modclean --save && \
	npm install --production
RUN \
    node-prune && \
	npx modclean -n default:safe,default:caution,default:danger

FROM node:16 as builder
ARG BUILD=edge

ENV \
	NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	BUILD=${BUILD}

WORKDIR /opt/app

COPY contracts contracts
COPY pages pages
COPY public public
COPY scripts scripts
COPY styles styles
COPY .eslintrc.json .eslintrc.json
COPY next.config.mjs next.config.mjs
COPY hardhat.config.js hardhat.config.js
COPY package.json package.json
COPY package-lock.json package-lock.json

COPY --from=dev-deps /opt/app/node_modules ./node_modules
RUN echo "NEXT_PUBLIC_BUILD=$BUILD" >> .env.local

RUN npm run build

FROM alpine:3.15 as runtime

ENV \
	NODE_ENV=production

RUN \
    apk add --no-cache \
        bash npm supervisor

ADD rootfs/runtime /

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

WORKDIR /opt/app

RUN addgroup app
RUN adduser --disabled-password --system --shell /bin/false --no-create-home --gecos "" --home /opt/app --ingroup app app

COPY --chown=app:app next.config.mjs next.config.mjs
COPY --chown=app:app hardhat.config.js hardhat.config.js
COPY --chown=app:app public public
COPY --chown=app:app package.json package-lock.json ./
COPY --from=prod-deps --chown=app:app /opt/app/node_modules ./node_modules
COPY --from=builder --chown=app:app /opt/app/pages ./artifacts
COPY --from=builder --chown=app:app /opt/app/.next ./.next

EXPOSE 3000
