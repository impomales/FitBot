import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User(1, 'imp@email.com', 2000)).toBeTruthy();
  });
});
