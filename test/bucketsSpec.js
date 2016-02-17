
const chai = require('chai');
const expect = chai.expect;
const { create_bucket } =  require('../lib/buckets') ;

describe('buckets', () => {

    describe('createBucket', () => {

        it('properly checks for required params', () => {
            const create = create_bucket({});
            const callCreate = function() {
                create({});
            };
            expect(callCreate).to.throw(Error);

        });
    });
});
