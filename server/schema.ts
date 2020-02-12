
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema } from 'nexus'
import * as types from './types'
import {join} from 'path'

//import getConfig from 'next/config'
//const { serverRuntimeConfig } = getConfig()
 const getPath = (fileName: string) =>
  join(process.cwd(),"server", "generated", fileName);

export const schema = makeSchema({
  types,
  plugins: [nexusPrismaPlugin()],
   outputs: {
    schema: getPath('schema.graphql'),
    typegen: getPath('nexus.ts'),
  }, 
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'client',
      },
     
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
  },
 
})
