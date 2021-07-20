/* eslint-disable quotes */
'use strict';

const fetch = require('node-fetch');

const newJobMatchesCriteria = ({ title, city }, { keywords, cities }) => {
  const includesKeyword = keywords.some(word => title.includes(word));
  const includesCity = cities.find(jobCity => city === jobCity);
  return includesKeyword || includesCity;
};

const sendEmail = (users) => console.log(users);

exports.newJob = async (ctx) => {
  // TODO move this to an env variable
  // TODO potentially use a gQL client
  const getJobResponse = await fetch('http://localhost:8080/v1/graphql', {
    'headers': {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
    },
    "body": "{\"query\":\"query MyQuery {\\n  jobs(limit: 1) {\\n    id\\n    title\\n    company_id\\n    city\\n  }\\n}\\n\",\"variables\":null,\"operationName\":\"MyQuery\"}",
    'method': 'POST',
  }).then(res => res.json());

  const jobAlertsResponse = await fetch('http://localhost:8080/v1/graphql', {
    'headers': {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
    },
    'referrer': 'http://localhost:8080/console/api-explorer',
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': '{"query":"query MyQuery {\\n  job_alerts {\\n    id\\n    email\\n    cities\\n    keywords\\n  }\\n}\\n","variables":null,"operationName":"MyQuery"}',
    'method': 'POST',
  }).then(res => res.json());

  const { job_alerts } = jobAlertsResponse.data;

  const { jobs } = getJobResponse.data;

  const usersToEmail = job_alerts.filter(user => newJobMatchesCriteria(jobs[0], user));

  sendEmail(usersToEmail);

  ctx.body = usersToEmail;
};
