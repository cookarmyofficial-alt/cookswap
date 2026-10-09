FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY --chown=node:node . .
RUN mkdir -p /app/data/admin && chown -R node:node /app/data
USER node
ENV HOST=0.0.0.0
EXPOSE 5012
CMD ["node","server.mjs"]
