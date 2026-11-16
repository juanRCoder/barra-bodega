const authBaseKey = ['auth'] as const;

export const authKeys = {
  all: authBaseKey,
  me: [...authBaseKey, 'me'] as const,
};

export const queryKeys = {
  auth: authKeys,
} as const;
