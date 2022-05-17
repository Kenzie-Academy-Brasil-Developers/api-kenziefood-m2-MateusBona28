import Api from "./Api.js";
import productsHomePage from "./dashboardScript.js"

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzZWViNTk3LTUzZGQtNDQ0MS04M2ZmLTkzMjIzYjFiY2Q5MyIsImlhdCI6MTY1Mjc5NTc3OCwiZXhwIjoxNjUzNjU5Nzc4LCJzdWIiOiJbb2JqZWN0IFVuZGVmaW5lZF0ifQ.8g38AzX3nY_zbsi_fCf9JCvakfxgcSUHsm5GrTSGNdM'
const produtos = await Api.getPrivateProducts(token)

productsHomePage(produtos)