import { PrismaClient } from '@prisma/client'
import * as Task from 'fp-ts/lib/Task'
import cuid from 'cuid'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import parse from 'csv-parse'
import { createReadStream, ReadStream } from 'fs'
import { join } from 'path'
import { async } from 'rxjs/internal/scheduler/async'
const photon = new PrismaClient();

const errorChar = '��'
const tasks = [
    () => photon.news.deleteMany({
        where: {
            title: { contains: errorChar },
            subTitle: { contains: errorChar },
            sourceUrl: { contains: errorChar },
            infoSource: { contains: errorChar },
            content: { contains: errorChar },
            id: { contains: errorChar },
            province: { contains: errorChar },
        }
    }),
    () => photon.rumor.deleteMany({
        where: {
            title: { contains: errorChar },
            subTitle: { contains: errorChar },
            content: { contains: errorChar },

            id: { contains: errorChar },

        }
    }),
    () => photon.cityRecord.deleteMany({
        where: {
            country: { id: { contains: errorChar }, title: { contains: errorChar }, },

            city: {
                id: { contains: errorChar }, title: { contains: errorChar }, province: {
                    id: { contains: errorChar }, title: { contains: errorChar }, country: {
                        id: { contains: errorChar }, title: { contains: errorChar }, continents: { contains: errorChar }
                    }
                }
            },

            id: { contains: errorChar },

        }
    }),
    () => photon.provinceRecord.deleteMany({
        where: {
            country: { id: { contains: errorChar }, title: { contains: errorChar }, },

            province: {
                id: { contains: errorChar }, title: { contains: errorChar }, country: {
                    id: { contains: errorChar }, title: { contains: errorChar }, continents: { contains: errorChar }
                }
            },

            id: { contains: errorChar },

        }
    }),
    () => photon.countryRecord.deleteMany({
        where: {
            country: { id: { contains: errorChar }, title: { contains: errorChar }, continents: { contains: errorChar } },



            id: { contains: errorChar },

        }
    }),
  
    () => photon.city.deleteMany({
        where: {
            id: { contains: errorChar }, title: { contains: errorChar }, province: {
                id: { contains: errorChar }, title: { contains: errorChar }, country: {
                    id: { contains: errorChar }, title: { contains: errorChar }, continents: { contains: errorChar }
                }
            }
        },
    }),
    () => photon.province.deleteMany({
        where: {
            id: { contains: errorChar }, title: { contains: errorChar }, country: {
                id: { contains: errorChar }, title: { contains: errorChar }, continents: { contains: errorChar }
            }
        },
    }),
    () => photon.country.deleteMany({
        where: { id: { contains: errorChar }, title: { contains: errorChar }, continents: { contains: errorChar } },
    }),
]
pipe(
    () => photon.connect(),
    Task.chain(() => pipe(
        tasks,
        A.array.sequence(Task.taskSeq),
        Task.chain(() => photon.disconnect),
        Task.map(() => console.log('over'))
    ))
)
