import { Kind } from 'graphql/language';

export default {
  __parseValue(value) {
    return value;
  },
  __serialize(value) {
    return value;
  },
  __parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }

    return null;
  }
};
