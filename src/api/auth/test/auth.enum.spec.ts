import { PostgresErrorCode } from '../database/postgres-error-code.enum';

describe('AuthEnum', () => {
  describe('UniqueViolation', () => {
    it('should return true', () => {
      expect(PostgresErrorCode.UniqueViolation).toEqual('23505');
    });
  });
});
