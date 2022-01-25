import dotenv from 'dotenv'
dotenv.config()
const corsOptions = {
  origin: process.env.KNOW_IT_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
}

export { corsOptions }
