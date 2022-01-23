import { idService } from './id';

describe('Id Service', () => {
  it('should generate a random 12 chars long id', () => {
    const id = idService.generate();
    expect(typeof id).toEqual('string');
    expect(id).toHaveLength(12);
  });
});
