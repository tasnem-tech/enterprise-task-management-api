import { AuthController } from './auth.controller';
describe('AuthController', () => {
 it('constructs with dependencies', () => {
  const controller = new AuthController({} as any, {} as any);
  expect(controller).toBeDefined();
 });
});
