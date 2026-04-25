/* eslint-disable no-console */
import chalk from 'chalk';

import { getCurrentSuite, Suite } from '../internal/suite.js';

interface TestFailure {
  label: string;
  error: unknown;
}

function suiteHasMatchingTests(
  suite: Suite,
  prefix: string,
  filter: string
): boolean {
  const label = prefix ? `${prefix} > ${suite.name}` : suite.name;

  for (const t of suite.tests) {
    const testLabel = label ? `${label} > ${t.name}` : t.name;

    if (testLabel.toLowerCase().includes(filter.toLowerCase())) {
      return true;
    }
  }

  for (const child of suite.children) {
    if (suiteHasMatchingTests(child, label, filter)) {
      return true;
    }
  }

  return false;
}

interface RunSuiteOptions {
  suite: Suite;
  prefix: string;
  failures: TestFailure[];
  filter?: string;
}

async function runSuite(
  options: RunSuiteOptions
): Promise<{ passed: number; failed: number }> {
  const { suite, prefix, failures, filter } = options;
  let passed = 0;
  let failed = 0;
  const label = prefix ? `${prefix} > ${suite.name}` : suite.name;

  if (filter && !suiteHasMatchingTests(suite, prefix, filter)) {
    return { passed, failed };
  }

  if (!prefix && suite.file) {
    console.log(chalk.cyan(`\n${suite.file}`));
  }

  for (const hook of suite.hooks.beforeAll) {
    await hook();
  }

  for (const t of suite.tests) {
    const testLabel = label ? `${label} > ${t.name}` : t.name;

    if (filter && !testLabel.toLowerCase().includes(filter.toLowerCase())) {
      continue;
    }

    try {
      await t.fn();
      passed++;

      console.log(chalk.green(`  ✓ ${testLabel}`));
    } catch (error) {
      failed++;
      failures.push({ label: testLabel, error });

      console.log(chalk.red(`  ✗ ${testLabel}`));
    }
  }

  for (const child of suite.children) {
    const r = await runSuite({ suite: child, prefix: label, failures, filter });

    passed += r.passed;
    failed += r.failed;
  }

  for (const hook of suite.hooks.afterAll) {
    await hook();
  }

  return { passed, failed };
}

function printFailure(f: TestFailure): void {
  console.log(chalk.red(`  ✗ ${f.label}`));

  if (f.error instanceof Error) {
    console.log(chalk.yellow(`    ${f.error.message}`));

    if (f.error.stack) {
      console.log(chalk.dim(`    ${f.error.stack}`));
    }
  } else {
    console.log(chalk.yellow(`    ${String(f.error)}`));
  }

  console.log();
}

export interface RunTestsOptions {
  filterPattern?: string;
}

export async function runTests(options: RunTestsOptions = {}): Promise<void> {
  const { filterPattern } = options;

  console.log(chalk.bold('\nRunning e2e tests...\n'));

  if (filterPattern) {
    console.log(chalk.dim(`  Filter: ${filterPattern}\n`));
  }

  const failures: TestFailure[] = [];
  const { passed, failed } = await runSuite({
    suite: getCurrentSuite(),
    prefix: '',
    failures,
    filter: filterPattern,
  });

  console.log(
    `\n${chalk.green(`${passed} passed`)}, ${chalk.red(`${failed} failed`)}\n`
  );

  if (failures.length > 0) {
    console.log(chalk.red.bold('Failed tests:\n'));

    for (const f of failures) {
      printFailure(f);
    }

    process.exit(1);
  }
}
