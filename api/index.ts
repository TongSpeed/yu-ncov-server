import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../server/schema'
import { createContext } from '../server/context'

const apolloServer=new ApolloServer({ schema, context: createContext })
export default apolloServer.createHandler({ path: '/api' })