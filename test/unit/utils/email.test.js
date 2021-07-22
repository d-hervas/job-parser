const sendEmail = require('../../../app/utils/response');

describe('Email send success', () => {
  it('should send the email with the provided account and subject', async () => {
    const emailResponse = await sendEmail('test@jest.com', 'Subject');
    expect(emailResponse).toNotBeNull();
  });
});
