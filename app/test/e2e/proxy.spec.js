const nock = require('nock');
const chai = require('chai');
const config = require('config');

const { getTestServer } = require('./utils/test-server');
const { mockValidateRequestWithApiKey } = require('./utils/mocks');

chai.should();

let requester;

describe('Proxy links', () => {

    before(async () => {
        if (process.env.NODE_ENV !== 'test') {
            throw Error(`Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`);
        }

        requester = await getTestServer();
    });


    it('Proxy endpoints redirects per config values', async () => {
        mockValidateRequestWithApiKey({});

        nock('http://test1.com')
            .get('/')
            .reply(200, 'hello world');

        const response = await requester
            .get(`/api/v1/proxy/test1`)
            .set('x-api-key', 'api-key-test');

        response.status.should.equal(200);
    });

    afterEach(async () => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
