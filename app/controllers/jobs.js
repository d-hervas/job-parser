'use strict';

// TODO probably could use more descriptive error msg/logging but w/e

const fetch = require('node-fetch');
const sendMail = require('../utils/mail');
const newJobMatchesCriteria = require('../utils/jobs');

// TODO move this to .env vars
const GQL_URL = 'http://localhost:8080/v1/graphql';
const getFetchPayload = body => ({
  'headers': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
  },
  body,
  'method': 'POST',
});


/**
 * @swagger
 * /spec:
 *   post:
 *     summary: Post new job to database
 *     operationId: postNewJob
 */
exports.newJob = async (ctx) => {
  // TODO Use a gQL client or at least build the body "objects" as objects and not pasting stringified JSON
  const newJobQuery = '{"query":"query MyQuery {\\n  jobs(limit: 1) {\\n    id\\n    title\\n    company_id\\n    city\\n  }\\n}\\n","variables":null,"operationName":"MyQuery"}';
  const jobAlertsQuery = '{"query":"query MyQuery {\\n  job_alerts {\\n    id\\n    email\\n    cities\\n    keywords\\n  }\\n}\\n","variables":null,"operationName":"MyQuery"}';

  const newJobResponse = await fetch(GQL_URL, getFetchPayload(newJobQuery))
    .then(res => res.json())
    .catch(() => ctx.throw(500, 'Error requesting latest job from database'));
  if (!newJobResponse) {
    ctx.throw(400, 'Job not found');
  }
  const latestJob = newJobResponse.data.jobs[0];

  // TODO a better way to do this is probably to load it in-memory on startup and then set up a trigger
  // to update, just like this newJob function works. Requesting the job_alerts table could get *slow*
  const jobAlertsResponse = await fetch(GQL_URL, getFetchPayload(jobAlertsQuery))
    .then(res => res.json())
    .catch(() => ctx.throw(500, 'Error requesting job alerts'));
  if (!jobAlertsResponse) {
    ctx.throw(400, 'Job collection not found');
  }
  const jobAlerts = jobAlertsResponse.data.jobs;

  let usersToEmail = [];
  try {
    usersToEmail = jobAlerts.filter(user => newJobMatchesCriteria(latestJob, user));
  } catch (err) {
    ctx.throw(500, 'Error when parsing which users to notify');
  }

  const mailResponse = await sendMail(usersToEmail, latestJob.title).catch(() =>
    ctx.throw(500, 'Error when sending email')
  );

  // eslint-disable-next-line require-atomic-updates
  ctx.body = mailResponse;
};
