
const should = require('should');

const { createSessionHandler } = require('../src/sessionUtil');

describe('b2session', () => {
    describe('createSessionHandler', () => {

        it( 'calls actual function when ready', () => {
            var argCalled;
            const api = {
                ready() {
                    return Promise.resolve({});
                }
            };
            const store = {
                token() {
                    return '123';
                }
            };
            const theFunc = () => {
                return (arg) => {
                    argCalled = arg;
                    return Promise.resolve(arg);
                };
            };
            const handler = createSessionHandler({ api, store, theFunc });
            handler('hey').then ( ()=> {
                should(argCalled).be.exactly('hey');
            });

        });
    });
});
