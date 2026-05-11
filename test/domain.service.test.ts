/// <reference types="mocha" />
import { expect } from "chai";
import domainService from "../src/services/domain.service";

describe("domainService", () => {
  it("should return domain information", async () => {
    const result = await domainService.lookup("google.co.uk");

    expect(result).to.have.property("domain");
    expect(result.domain).to.equal("google.co.uk");
  });
});