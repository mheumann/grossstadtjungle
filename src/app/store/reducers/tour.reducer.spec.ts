import { tourReducer, initialState } from './tour.reducer';

describe('Questions Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = tourReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
