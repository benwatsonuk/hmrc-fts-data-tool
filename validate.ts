import Ajv from "ajv"
import schema from "./schema.json"
import { PageFlowArray, PagesArray, StagesArray } from "./types"

const ajv = new Ajv({ allErrors: true, strict: false })

const validate = ajv.compile(schema)

export function validatePagesArray(pages: unknown): PagesArray {
  if (!validate({ mode: "pages", pages: pages })) {
    const message = validate.errors
      ?.map(err => `${err.instancePath || "Pages"} ${err.message}`)
      .join("\n")

    throw new Error(
      `Invalid array of PAGES passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected:\n${message}`
    )
  }

  return pages as PagesArray
}

export function validateStagesArray(stages: unknown): StagesArray {
  if (!validate({ mode: "stages", stages: stages })) {
    const message = validate.errors
      ?.map(err => `${err.instancePath || "Stages"} ${err.message}`)
      .join("\n")

    throw new Error(
      `Invalid array of STAGES passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected:\n${message}`
    )
  }

  return stages as StagesArray
}


export function validatePageFlowArray(flows: PageFlowArray): PageFlowArray {
  if (!validate({ mode: "flows", flows: flows})) {
    const message = validate.errors
      ?.map(err => `${err.instancePath || "Flows"} ${err.message}`)
      .join("\n")

    throw new Error(
      `Invalid array of FLOWS passed to govuk-pages-plugin - please check the documentation to ensure the JSON schema you are passing matches what is expected:\n${message}`
    )
  }

  return flows as PageFlowArray
}
