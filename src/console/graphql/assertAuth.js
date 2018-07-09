import { UnauthorizedError } from '../errors';

export default function assertAuth() {
  return (target, property, descriptor) => {
    return {
      value(root, args, context) {
        UnauthorizedError.assert(context.auth);
        return descriptor.value(root, args, context);
      }
    };
  };
}
