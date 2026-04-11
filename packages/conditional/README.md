# conditional

A minimal expression language for conditional data resolution in game-cms. A condition is a single string that evaluates to a boolean, string, or number. Conditions are used inside `ConditionalData` structures to select a value from a list of guarded alternatives.

## Syntax

### Variables

A variable is written as `$` followed by an alphanumeric identifier. At evaluation time it is resolved from a supplied input record.

```
$health
$playerName
$level
```

### Literals

Numeric and alphanumeric literals are written bare:

```
123
42
```

String literals that contain spaces or operator characters must be wrapped in single quotes:

```
'hello world'
'some && text'
```

The keywords `true` and `false` are recognised as boolean tokens.

### Operators

| Syntax | Name | Type   | Operand types             |
| ------ | ---- | ------ | ------------------------- |
| `!`    | not  | unary  | boolean                   |
| `&&`   | and  | binary | boolean × boolean         |
| `\|\|` | or   | binary | boolean × boolean         |
| `==`   | eq   | binary | any atom × any atom       |
| `!=`   | neq  | binary | any atom × any atom       |
| `<`    | lt   | binary | number × number (coerced) |
| `<=`   | lte  | binary | number × number (coerced) |
| `>`    | gt   | binary | number × number (coerced) |
| `>=`   | gte  | binary | number × number (coerced) |

Comparison operators (`<`, `<=`, `>`, `>=`) coerce both operands to numbers via `parseFloat`. If either operand cannot be coerced the evaluation throws a `TypeError`.

Logical operators (`&&`, `||`) require both sides to evaluate to booleans.

### Grouping

Sub-expressions can be wrapped in parentheses to override default left-to-right precedence:

```
(1 && 2) || 3
$abc==123 && ((123 || 321) == $cba)
```

### Examples

```
$name
!$active
$health<=100
$name=='Alice'
$score==100 && $level>=5
($a || $b) && $c
```

## AST

The parser produces a recursive AST. Each node carries a `$type` discriminant:

| `$type`   | Fields                   |
| --------- | ------------------------ |
| `var`     | `name: string`           |
| `literal` | `value: string`          |
| `binary`  | `operator`, `lhs`, `rhs` |
| `unary`   | `operator`, `expr`       |

All literal values (including bare numbers) are stored as strings in the AST. Numeric coercion happens at evaluation time only for the comparison operators.

## Evaluation

`evaluateConditionalExpression(expression, input)` walks the AST and resolves variables from `input: Record<string, string | number | boolean | undefined>`. It returns `string | number | boolean`. Referencing an unknown variable throws.

## ConditionalData

A `ConditionalData<T>` pairs a default value with an ordered list of `{ condition, value }` alternatives:

```ts
type ConditionalData<T> = {
  default: T;
  alternative: { condition: ConditionalAstExpression; value: T }[];
};
```

`resolveConditionalData(data, input)` evaluates each condition in order and returns the first matching value. If no condition matches it returns `data.default`.

## API

```ts
import {
  parseConditionalNotation, // string → ConditionalAstExpression
  evaluateConditionalExpression, // (ast, input) → string | number | boolean
  resolveConditionalData, // (ConditionalData<T>, input) → T
  conditionalAstExpressionToString, // ast → string (stringifier)
  inferExpressionOutput, // ast → 'boolean' | 'string' | 'dependsOnVar'
} from '@game-cms/conditional';
```
