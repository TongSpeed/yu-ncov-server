import { PrismaClient } from '@prisma/client'
import * as Task from 'fp-ts/lib/Task'
import cuid from 'cuid'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import parse from 'csv-parse'
import { createReadStream,ReadStream } from 'fs'
import { join } from 'path'
const photon = new PrismaClient();

import * as dateFns from 'date-fns';

//const wstream = createWriteStream(join(__dirname, '..', 'data', 'test.json'))
// Create the parser
const parser = parse({
    delimiter: ','
})

interface Rumor {
    id: string
    title: string
    subTitle: string
    content: string
    recordAt:Date
}
interface News{
    id: string
    title: string
    subTitle?: string
    content: string
    recordAt:Date
    infoSource:string
    province:string
    sourceUrl:string
}

interface InputNews{
    infoSource:string
    sourceUrl:string
    summary:string,
    title:string,
    pubDate:string
    provinceName:string
}
interface InputRumor{
    body:string,mainSummary:string,title:string,crawlTime:string
}
const RumorTask = ({id,title,subTitle,content,recordAt}: Rumor) => pipe(
    () => photon.rumor.upsert({
        where: {  },
        create: {
            id,
            title,
            subTitle,
            content,
            recordAt
        },
        update: {

        }
    }),
    Task.map(()=>void 0)
)

const toRumorObject=({body,mainSummary,title,crawlTime}:InputRumor):Rumor=>({
    id: cuid(),
    title,
    subTitle: mainSummary,
    content: body,
    recordAt:dateFns.parse(crawlTime, 'yyyy-MM-dd HH:mm:ss.SSS', new Date())
})
const toNewsObject=({provinceName,summary,title,infoSource,pubDate,sourceUrl}:InputNews):News=>({
    id: cuid(),
 
    title,
    content: summary,
  
    infoSource,
    province:provinceName,
    sourceUrl,
    recordAt:dateFns.parse(pubDate, 'yyyy-MM-dd HH:mm:ss', new Date())
})
const newsTask = (a: News) => pipe(
    () => photon.news.upsert({
        where: { sourceUrl: a.sourceUrl },
        create: a,
        update: {

        }
    }),
    Task.map(()=>void 0)
)
let currentIndex = 0;
const parseCSV = (f:((a:Record<string,string>)=>Task.Task<void>))=>(stream:ReadStream) => {
    //const stream = createReadStream(join(__dirname, '..', 'data', 'new', 'DXYOverall.csv'))
    const tasks: Task.Task<any>[] = []
    let countryHeader:Record<string,number>={}
    parser.on('readable', function () {
        let record:any

        while (record = parser.read()) {
            if (currentIndex === 0) {
                const hs: string[] = record as string[]
                A.mapWithIndex((i, b: string) => {
                    countryHeader[b] = i
                })(hs)
                currentIndex = ++currentIndex

            } else {
                 try {
                  const current=  pipe(
                        Object.entries(countryHeader),
                        A.reduce({} as Record<string,string>,(result,[key,value])=>{
                            
                            return {
                                ...result,
                                [key]:record[value]
                            }
                        })
                    )
                  

                    tasks.push(f(current))
                } catch (error) {
                    console.error(record)
                }
            }



        }
    })
    parser.on('error', function (err) {
        console.error(err.message)
    })
    parser.on('end', function () {
        let i = 0;
        pipe(
            tasks,
            A.map(a => {
                return pipe(
                    a,
                    Task.map(() => {
                        console.log(`${++i}/${tasks.length}`)
                    })
                )
            }),
            A.array.sequence(Task.taskSeq),
            Task.map(() => {
           
                parser.end()
               // photon.disconnect();
            })

        )()

    })
    stream.pipe(parser)
}
const stream=createReadStream(join(__dirname,  'DXYNews.csv'))
stream.on('close',()=>{
    console.log('all end')
})
parseCSV(a=>pipe(
    a as any,
    toNewsObject,
    newsTask
    
))(stream)
