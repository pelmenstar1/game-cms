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

FROM node:24-alpine AS deploy

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --from=build /app/demo-platformer/cms/build ./demo-platformer/cms/build
COPY --from=build /app/demo-platformer/cms/node_modules ./demo-platformer/cms/node_modules
# COPY --from=build /app/node_modules /app/node_modules
# COPY --from=build --parents /app/packages/*/node_modules /app/../

RUN corepack enable
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=build /app/demo-platformer/cms/package.json ./demo-platformer/cms/package.json

WORKDIR /app/demo-platformer/cms

EXPOSE 3000
CMD ["npm", "run", "start"]
