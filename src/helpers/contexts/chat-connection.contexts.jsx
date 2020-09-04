import { createContext } from "react"

const ConnectionContext = createContext({
  connection: null,
  updateConnection: () => {},
  userDetails: {},
})

export default ConnectionContext;
