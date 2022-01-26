import { hash } from 'bcrypt';

export const hashString = async (str: string): Promise<string> => {
  return hash(str, 7);
};
