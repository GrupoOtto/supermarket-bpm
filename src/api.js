const bonita = require("./bonita")

const handle = fn => (req, res, next) => fn(req, res, next).catch(next)

const forCase = async (caseId) => null

const resolve = async (caseId) => null

module.exports = app => {
  app.get(
    "/products-list",
    handle(async (req, res) => {
      const credentials = await login()

      const caseId = initiate(credentials)('5662606861148655159')

      const list = await forCase(caseId)

      res.status(status.OK).json(await products.findByType(id))
    })
  )

  app.put("/response", handle(async (req, res) => {
    resolve(req.headers.caseId)(req.body)
  }))
}