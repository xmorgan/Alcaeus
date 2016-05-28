import {promises as jsonld} from 'jsonld';
import * as sinon from 'sinon';
import {Operation, ApiDocumentation} from '../src/ApiDocumentation';
import {Core} from '../src/Constants';
//noinspection TypeScriptCheckImport
import {owl} from 'jasnell/linkeddata-vocabs';

describe('Operation', () => {

    var operationJsonLd;

    beforeEach(() => operationJsonLd = {
        '@context': Core.Context,
        'title': 'The operation',
        'description': 'The operation description',
        'expects': 'http://www.w3.org/2002/07/owl#Nothing',
        'returns': 'http://example.com/Something',
        'method': 'TRACE'
    });

    it('should expose operation method', (done:any) => {
        jsonld.compact(operationJsonLd, {}).then(compacted => {
            var op = new Operation(compacted, <IHeracles>{});

            expect(op.method).toBe('TRACE');
            done();
        }).catch(done.fail);
    });

    it('should expose expected class id', (done:any) => {
        jsonld.compact(operationJsonLd, {}).then(compacted => {
            var op = new Operation(compacted, <IHeracles>{});

            expect(op.expects['@id']).toBe('http://www.w3.org/2002/07/owl#Nothing');
            done();
        }).catch(done.fail);
    });

    it('should expose returned class id', (done:any) => {
        jsonld.compact(operationJsonLd, {}).then(compacted => {
            var op = new Operation(compacted, <IHeracles>{});

            expect(op.returns['@id']).toBe('http://example.com/Something');
            done();
        }).catch(done.fail);
    });

    describe('invoke', () => {

        var heracles;
        var operation = {
            '@context': Core.Context,
            'method': 'PUT'
        };

        beforeEach(() => heracles = {
            invokeOperation: sinon.stub()
        });

        it('should execute through heracles with JSON-LD media type', (done) => {

            jsonld.compact(operation, {}).then(compacted => {
                var op = new Operation(compacted, <IHeracles>heracles);
                var payload = {};

                op.invoke('http://target/address', payload);

                expect(heracles.invokeOperation.calledWithExactly(op, 'http://target/address', payload, 'application/ld+json'))
                    .toBeTruthy();
                done();
            }).catch(done.fail);
        });

        it('should execute through heracles with changed media type', (done) => {

            jsonld.compact(operation, {}).then(compacted => {
                var op = new Operation(compacted, <IHeracles>heracles);
                var payload = {};

                op.invoke('http://target/address', payload, 'text/turtle');

                expect(heracles.invokeOperation.firstCall.args[3])
                    .toBeTruthy('text/turtle');
                done();
            }).catch(done.fail);
        });

    });
    
    describe('requiresInput', () => {

        it('should return false for GET operation', done => {
            var operation = {
                '@context': Core.Context,
                'method': 'GET'
            };

            jsonld.compact(operation, {}).then(compacted => {
                var op = new Operation(compacted, <IHeracles>{});

                expect(op.requiresInput).toBe(false);
                done();
            }).catch(done.fail);
        });

        it('should return false for DELETE operation', done => {
            var operation = {
                '@context': Core.Context,
                'method': 'DELETE'
            };

            jsonld.compact(operation, {}).then(compacted => {
                var op = new Operation(compacted, <IHeracles>{});

                expect(op.requiresInput).toBe(false);
                done();
            }).catch(done.fail);
        });

        it('should return true if operation expects a body', done => {
            var operation = {
                '@context': Core.Context,
                'method': 'POST'
            };

            jsonld.compact(operation, {}).then(compacted => {
                var op = new Operation(compacted, <IHeracles>{});

                expect(op.requiresInput).toBe(true);
                done();
            }).catch(done.fail);
        });

        it('should return true if operation expects nothing', done => {
            var operation = {
                '@context': Core.Context,
                'method': 'POST'
            };

            jsonld.compact(operation, {}).then(compacted => {

                compacted[Core.Vocab.expects] = { id: owl.ns + 'Nothing' };
                var op = new Operation(compacted, <IHeracles>{});

                expect(op.requiresInput).toBe(true);
                done();
            }).catch(done.fail);
        });
        
    });
});