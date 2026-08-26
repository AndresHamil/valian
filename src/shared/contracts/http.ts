export type ApiEnvelope<TData> = {
  success: boolean;
  message: string;
  error: string | null;
  data: TData;
};

export type ApiMutationResult = {
  success: boolean;
  message: string;
  error: string | null;
};

export type ValidationResult = {
  isValid: boolean;
  message: string | null;
};