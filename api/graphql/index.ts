import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../../server/schema'
import { createContext } from '../../server/context'

export const config = {
    api: {
      bodyParser: false
    }
  }
const apolloServer=new ApolloServer({ schema, context: createContext })
export default apolloServer.createHandler({ path: '/api/graphql' })