FROM node:24-alpine AS build

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --parents ./configs/* ./
COPY --parents ./demo-platformer/backend ./
COPY --parents ./demo-platformer/frontend ./

RUN pnpm install --frozen-lockfile

WORKDIR /app/demo-platformer/backend
RUN pnpm build

WORKDIR /app/demo-platformer/frontend
RUN pnpm build

FROM node:24-alpine AS deploy

RUN corepack enable

WORKDIR /app

COPY --from=build /app/demo-platformer/backend/dist ./demo-platformer/backend/dist
COPY --from=build /app/demo-platformer/frontend/dist ./demo-platformer/frontend/dist
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --parents ./demo-platformer/backend/package.json ./
COPY --parents ./demo-platformer/frontend/package.json ./

WORKDIR /app/demo-platformer/backend

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

EXPOSE 3000

CMD ["node", "./dist/main.js"]
