/* eslint-disable max-len */
/* jscs:disable maximumLineLength */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const analytics = {
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },
};

export const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY || '0qmT1TqoQesHqBkqgM2FxJpNd';
export const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET || 'eOMfUAjHEUrPNLORYSFoVzIT5r1gGrgzl2lTBD8Diclf6IIGkY';
export const movesClientId = process.env.MOVES_CLIENT_ID || 'Ju5DixA188VObZJ26S1_DQYz1dOYNFqh'
export const movesClientSecret = process.env.MOVES_CLIENT_SECRET || 'GtdZ03pemIfJOz6_JFlE8aMUsUIVn8LH0v0M9h80KOa41BIy0BQe24fRDH49u_q8'
export const cookieSecret = process.env.COOKIE_SECRET || '31eara!43141lmjfeaoruic:n542';
export const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000';
export const externalApiUrl = process.env.EXTERNAL_API_URL || 'http://localhost:4000';
