export type IErrorDetails = {
  errorMessage: string;
  stackTrace?: string;
  errorName?: string;
  occurredAt?: Date;
  requestId?: string;
  serviceName?: string;
  additionalInfo?: Record<string, any>;
  receiverEmail: string;
  receiverEmailAnother: string;
};
