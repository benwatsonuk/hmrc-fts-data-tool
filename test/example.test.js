const expect = require('chai').expect

const getStages = require('../src/functions/stages/getStages.ts')
const {validStages, invalidStages} = require('./data/stages.ts')
const {validPages, invalidPages, pagesWithNoStages} = require('./data/pages.ts')
const outputs = require('./data/outputs.ts')

describe('Basic getStages functions', () => {
    describe('getStages', () => {
      it('should return a simple array of stages when VALID stages JSON is provided', () => {
        const result = getStages.getStages(validStages)
        const output = outputs.getStagesTest.output
        expect(result).to.eql(output)
      })

      it('should return a useful error when INVALID stages JSON is provided', () => {
        expect(() => getStages.getStages(invalidStages)).to.throw("Invalid array of STAGES passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected")
      })
    });

     describe('getStagesWithPages', () => {
      it('should return an array of stages with pages inside when VALID stages and pages JSON are provided', () => {
        const result = getStages.getStagesWithPages(validStages, validPages)
        const output = outputs.getStagesWithPagesTestB.output
        expect(result).to.eql(output)
      })

      it('should return an array with a single "Unassigned" stage with all unassigned pages inside when VALID stages and pages JSON are provided but pages have no parent stage', () => {
        const result = getStages.getStagesWithPages(validStages, pagesWithNoStages)
        const output = outputs.getStagesWithPagesTestA.output
        expect(result).to.eql(output)
      })

      it('should return a useful error when INVALID stages but VALID pages JSON is provided', () => {
        expect(() => getStages.getStagesWithPages(invalidStages, validPages)).to.throw("Invalid array of STAGES passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected")
      })

      it('should return a useful error when INVALID stages and INVALID pages JSON is provided', () => {
        expect(() => getStages.getStagesWithPages(invalidStages, invalidPages)).to.throw("Invalid array of STAGES passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected")
      })

      it('should return a useful error when VALID stages and INVALID pages JSON is provided', () => {
        expect(() => getStages.getStagesWithPages(validStages, invalidPages)).to.throw("Invalid array of PAGES passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected")
      })
    });
});
