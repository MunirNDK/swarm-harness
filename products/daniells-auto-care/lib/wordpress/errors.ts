export class WordPressFetchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly url?: string
  ) {
    super(message);
    this.name = 'WordPressFetchError';
  }
}

export class WordPressValidationError extends Error {
  constructor(message: string, public readonly issues: unknown) {
    super(message);
    this.name = 'WordPressValidationError';
  }
}
