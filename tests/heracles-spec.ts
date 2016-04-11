/// <reference path="../typings/main.d.ts" />

import * as sinon from 'sinon';
import * as heracles from '../src/heracles';
import {Responses} from './test-responses';

describe('Hydra resource', () => {
    beforeEach(() => {
        sinon.stub(heracles.Hydra.ApiDocumentation, 'load');
        sinon.stub(window, 'fetch');
    });

    it('should load resource with RDF accept header', done => {
        window.fetch.returns(Promise.resolve(Responses.jsonLdResponse()));

        heracles.Hydra.load('http://example.com/resource')
            .then((res) => {
                expect(window.fetch.calledWithMatch('http://example.com/resource', {
                    headers: {
                        accept: 'application/ld+json, application/ntriples, application/nquads'
                    }
                })).toBe(true);

                done();
            })
            .catch(done.fail);
    });

    it('should leave json-ld intact', done => {
        window.fetch.returns(Promise.resolve(Responses.jsonLdResponse()));

        heracles.Hydra.load('http://example.com/resource')
            .then(jsonLd => {
                expect(jsonLd.prop['@value']).toBe('some textual value');
                done();
            })
            .catch(done.fail);
    });

    it('should load documentation', done => {
        window.fetch.returns(Promise.resolve(Responses.jsonLdResponse()));

        heracles.Hydra.load('http://example.com/resource')
            .then(() => {
                expect(heracles.Hydra.ApiDocumentation.load.calledWithMatch('http://api.example.com/doc/')).toBe(true);
                done();
            })
            .catch(done.fail);
    });

    afterEach(() => {
        window.fetch.restore();
        heracles.Hydra.ApiDocumentation.load.restore();
    });
});