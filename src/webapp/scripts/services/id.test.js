import generateNanoId from 'nanoid/generate';
import { IdService, idService } from './id';

describe('Id Service', () => {
  function mockDependencies(){
    return { generateNanoId: jest.fn() };
  }

  it('should use generate nano id if no id generator has been given', () => {
    const idService = new IdService();
    expect(idService.generateNanoId).toEqual(generateNanoId);
  });

  it('should generate some id', () => {
    const idService = new IdService(mockDependencies());
    idService.generate();
    expect(idService.generateNanoId).toHaveBeenCalled();
  });

  it('should config valid characters range when generating some id', () => {
    const idService = new IdService(mockDependencies());
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_';
    idService.generate();
    expect(idService.generateNanoId).toHaveBeenCalledWith(chars, 12);
  });

  it('should export a singleton', () => {
    expect(idService instanceof IdService).toEqual(true);
  });
});
