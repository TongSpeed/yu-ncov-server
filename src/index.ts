import { ApolloServer } from 'apollo-server-micro'
import { schema } from './schema'
import { createContext } from './context'

const apolloServer=new ApolloServer({ schema, context: createContext })
export default apolloServer.createHandler({ path: '/api' })