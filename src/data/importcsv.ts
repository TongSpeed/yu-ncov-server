import { PrismaClient } from '@prisma/client'
import * as Task from 'fp-ts/lib/Task'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import parse from 'csv-parse'
import {  ReadStream } from 'fs'

export interface Options {
    delimiter: string,
    maxCount: number,
    log: (a: string) => void,
    error: (a: string) => void
}
const parseCSV = ({
    delimiter,
    maxCount = 200,
    log,
    error,
}: Options) =>
    (f: ((a: Record<string, string>) => Task.Task<void>)) =>
        (stream: ReadStream) => {
            let isHead = true;
            let totalCount = 0;
            let totalWriteCount = 0;

            const parser = parse({
                delimiter,
            })
            const countryHeader: Record<string, number> = {}
            parser.on('readable', function () {

                const reader = () => {
                    const tasks: Task.Task<any>[] = []

                    let currentIndex = 0;
                    while (currentIndex <= maxCount) {
                        const record = parser.read()
                        if (isHead) {
                            const hs: string[] = record as string[]
                            A.mapWithIndex((i, b: string) => {
                                countryHeader[b] = i
                            })(hs)
                            isHead = false
                        } else {
                            try {
                                const current = pipe(
                                    Object.entries(countryHeader),
                                    A.reduce({} as Record<string, string>, (result, [key, value]) => {

                                        return {
                                            ...result,
                                            [key]: record[value]
                                        }
                                    })
                                )

                                tasks.push(f(current))
                            } catch (error) {
                                log(error)
                                error(record)
                            }
                        }
                        ++currentIndex
                        ++totalCount
                    }
                    return tasks
                }
                const write = (tasks: Task.Task<any>[]): Task.Task<any> => {
                    let i = 0;
                    return pipe(
                        tasks,
                        A.map(a => {
                            return pipe(
                                a,
                                Task.map(() => {

                                    log(`${++i}/${tasks.length}--${totalWriteCount}/${totalCount}`)
                                    ++totalWriteCount
                                })
                            )
                        }),
                        A.array.sequence(Task.taskSeq),
                        Task.chain(() => {

                            const _tasks = reader()
                            if (_tasks.length > 0) {
                                return write(_tasks)
                            } else {
                                return () => Promise.resolve(void 0)
                            }
                        })
                    )
                }

                write(reader())()

                // one()

            })
            parser.on('error', function (err) {
                error(err.message)
            })
            parser.on('end', function () {

            })
            stream.pipe(parser)
        }
export default parseCSV