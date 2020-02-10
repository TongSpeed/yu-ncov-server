import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../src/schema'
import { createContext } from '../src/context'

const apolloServer=new ApolloServer({ schema, context: createContext })
export default apolloServer.createHandler({ path: '/api' })