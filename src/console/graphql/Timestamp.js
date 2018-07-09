import { Kind } from 'graphql/language';

export default {
  __parseValue(value) {
    return value;
  },
  __serialize(value) {
    return value.toISOString();
  },
  __parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  }
};
