export class PavlovError extends Error {
  constructor(message, { name = 'PavlovError', cause = null } = {}) {
    super();
    this.message = message;
    this.name = name;
    this.cause = cause;
    this.stack = new Error(message).stack;
  }

  assert(ok) {
    if (!ok) {
      throw this;
    }
  }

  static wrap(cause, opts = {}) {
    return new this(null, { ...opts, cause });
  }

  static assert(ok, message, opts = {}) {
    if (!ok) {
      throw new this(message, opts);
    }
  }
}

export class ClientError extends PavlovError {
  constructor(message, opts = {}) {
    super(message || 'client error', { name: 'ClientError', ...opts });
    this.status = opts.status || 400;
  }
}

export class ServerError extends PavlovError {
  constructor(message, opts = {}) {
    super(message || 'server error', { name: 'ServerError', ...opts });
    this.status = opts.status || 500;
  }
}

export class UnauthorizedError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'unauthorized', {
      name: 'UnauthorizedError',
      status: 401,
      ...opts
    });
  }
}

export class NotFoundError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'not found', {
      name: 'NotFoundError',
      status: 404,
      ...opts
    });
  }
}

export class InvalidIdentifierError extends ClientError {
  constructor(value, opts = {}) {
    super(`invalid identifier: ${value}`, {
      name: 'InvalidIdentifierError',
      status: 400,
      ...opts
    });
  }
}

export class InvalidCAPTCHAError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'invalid CAPTCHA', {
      name: 'InvalidCAPTCHAError',
      status: 400,
      ...opts
    });
  }
}

export class InvalidOAuthError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'invalid OAuth code or state', {
      name: 'InvalidOAuthError',
      status: 400,
      ...opts
    });
  }
}

export class ExternalRequestError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'external request error', {
      name: 'ExternalRequestError',
      status: 500,
      ...opts
    });
  }
}

export class WaitError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'waiting for file', {
      name: 'WaitError',
      status: 500,
      ...opts
    });
  }
}

export class ImageProcessingError extends ClientError {
  constructor(message, opts = {}) {
    super(message || 'image processing error', {
      name: 'ImageProcessingError',
      status: 400,
      ...opts
    });
  }
}
