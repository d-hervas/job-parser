const { newJobMatchesCriteria } = require('../../../app/utils/jobs');

describe('Job matches criteria', () => {
  it('Should return a true value', () => {
    const mockJob = {
      title: 'Test job title',
      city: 'Ravenholm'
    };
    const mockNotification = {
      keywords: ['Test'],
      cities: ['Ravenholm']
    };
    const matchesCriteria = newJobMatchesCriteria(mockJob, mockNotification);
    expect(matchesCriteria).toBe(true);
  });
  it('Should return false', () => {
    const mockJob = {
      title: 'Test job subject',
      city: 'Ravenholm'
    };
    const mockNotification = {
      keywords: ['Pest', 'mob'],
      cities: ['Columbia', 'Rapture']
    };
    const matchesCriteria = newJobMatchesCriteria(mockJob, mockNotification);
    expect(matchesCriteria).toBe(false);
  });
});
