FROM node:24-alpine AS deps

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --parents ./packages/*/package.json ./
COPY --parents ./demo-platformer/cms/package.json ./

RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS build

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.packages.json ./
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps --parents /app/packages/*/node_modules /app/../

COPY --parents ./demo-platformer/cms ./packages ./configs ./

RUN pnpm prebuild
RUN pnpm install --frozen-lockfile

WORKDIR /app/demo-platformer/cms

RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
