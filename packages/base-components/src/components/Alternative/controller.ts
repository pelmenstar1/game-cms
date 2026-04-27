import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { unknownConditionalData } from '@game-cms/conditional/schema';
import { defineComponentController, searchScoreComposer } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator(data, (element) =>
      context.validate(componentId, element, baseOptions)
    );
  },
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  innerDependencies: (options, context) =>
    context.getDependencies(options.componentId, options.baseOptions),
  migrate: (data, options, context) => {
    const result = unknownConditionalData.safeParse(data);

    if (result.success) {
      const { componentId, baseOptions } = options;

      return {
        default: context.migrate(componentId, result.data.default, baseOptions),
        alternative: result.data.alternative.map((choice) => ({
          condition: choice.condition,
          value: context.migrate(componentId, choice.value, baseOptions),
        })),
      };
    }
  },
  atomWalker: {
    applyEach: (data, options, apply, context) => {
      const { componentId, baseOptions } = options;

      context.applyEach(componentId, data.default, baseOptions, apply);

      for (const choice of data.alternative) {
        context.applyEach(componentId, choice.value, baseOptions, apply);
      }
    },
    filter: (data, options, predicate, context) => {
      const { componentId, baseOptions } = options;

      return {
        default: predicate(componentId, data.default, baseOptions)
          ? context.filter(componentId, data.default, baseOptions, predicate)
          : context.getDefaultData(componentId, baseOptions),
        alternative: data.alternative
          .filter(({ value }) => predicate(componentId, value, baseOptions))
          .map(({ condition, value }) => ({
            condition,
            value: context.filter(componentId, value, baseOptions, predicate),
          })),
      };
    },
  },
  outerLinkController: {
    contains: (outerLink, data, options, context) => {
      const { componentId, baseOptions } = options;

      if (context.contains(outerLink, componentId, data.default, baseOptions)) {
        return true;
      }

      return data.alternative.some(({ value }) =>
        context.contains(outerLink, componentId, value, baseOptions)
      );
    },
    delete: (outerLink, data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        default: context.delete(
          outerLink,
          componentId,
          data.default,
          baseOptions
        ),
        alternative: data.alternative.map(({ condition, value }) => ({
          condition,
          value: context.delete(outerLink, componentId, value, baseOptions),
        })),
      };
    },
  },
  search: {
    getScore: (query, target, options, context) => {
      const {
        storage: { alternative, default: defaultStorage },
        searchIndex,
      } = target;

      const { componentId, baseOptions } = options;

      const composer = searchScoreComposer();

      composer.include(
        context.getScore(
          query,
          componentId,
          {
            storage: defaultStorage,
            searchIndex: searchIndex.default,
          },
          baseOptions
        )
      );

      for (let i = 0; i < alternative.length; i++) {
        composer.include(
          context.getScore(
            query,
            componentId,
            {
              storage: alternative[i].value,
              searchIndex: searchIndex.alternative[i],
            },
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      const [defaultIndex, ...alternativeIndexes] = await Promise.all([
        context.createSearchIndex(componentId, data.default, baseOptions),
        ...data.alternative.map((choice) =>
          context.createSearchIndex(componentId, choice.value, baseOptions)
        ),
      ]);

      return {
        default: defaultIndex,
        alternative: alternativeIndexes,
      };
    },
  },
  resolver: (input, options, context, args) => {
    const result = resolveConditionalData(input, args as ConditionalValueInput);

    return context.resolveOutData(
      options.componentId,
      result,
      options.baseOptions,
      args
    );
  },
  storageTransformer: {
    getDefaultData: (options, context) => ({
      default: context.getDefaultData(options.componentId, options.baseOptions),
      alternative: [],
    }),
    fromStorage: async (data, options, context) => {
      const { baseOptions, componentId } = options;

      const [defaultValue, ...alternativeValues] = await Promise.all([
        context.fromStorage(componentId, data.default, baseOptions),
        ...data.alternative.map(async (choice) => ({
          condition: choice.condition,
          value: await context.fromStorage(
            componentId,
            choice.value,
            baseOptions
          ),
        })),
      ]);

      return {
        default: defaultValue,
        alternative: alternativeValues,
      };
    },
    toStorage: async (data, options, context) => {
      const { baseOptions, componentId } = options;

      const [defaultValue, ...alternativeValues] = await Promise.all([
        context.toStorage(componentId, data.default, baseOptions),
        ...data.alternative.map(async (choice) => ({
          condition: choice.condition,
          value: await context.toStorage(
            componentId,
            choice.value,
            baseOptions
          ),
        })),
      ]);

      return {
        default: defaultValue,
        alternative: alternativeValues,
      };
    },
    disposeData: async (data, options, context) => {
      const { baseOptions, componentId } = options;

      await Promise.all([
        context.disposeData(componentId, data.default, baseOptions),
        ...data.alternative.map(({ value }) =>
          context.disposeData(componentId, value, baseOptions)
        ),
      ]);
    },
  },
  clientOptionsTransformer: {
    toClient: (options, context) => {
      const { componentId, baseOptions } = options;

      return {
        componentId,
        baseOptions: context.toClient(componentId, baseOptions),
      };
    },
  },
});
