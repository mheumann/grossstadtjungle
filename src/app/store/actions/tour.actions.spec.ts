import * as fromTour from './tour.actions';

describe('loadTours', () => {
  it('should return an action', () => {
    expect(fromTour.loadTour().type).toBe('[Tour] Load Tour');
  });
});
