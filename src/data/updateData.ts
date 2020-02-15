import { PrismaClient } from '@prisma/client'
import * as Task from 'fp-ts/lib/Task'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import { pick } from 'macoolka-object'
import * as dateFns from 'date-fns';
import { isString } from 'macoolka-predicate'
import { convertTitle } from './dataHelpler'
import cuid from 'cuid'
const getTodayBegin = (a: Date | string) => {
    const cloneValue = new Date(isString(a) ? a : a.toISOString())
    const b = new Date(cloneValue.setHours(0, 0, 0, 0))
    return b;
}
const getTodayEnd = (a: Date | string) => {
    const cloneValue = new Date(isString(a) ? a : a.toISOString())
    const b = new Date(cloneValue.setHours(0, 0, 0, 0))
    return dateFns.addDays(b, 1)

}
export interface BasicRecord {
    suspectedCount: number,
    confirmedCount: number,
    curedCount: number,
    deadCount: number,
    recordAt: Date
}
export interface CountryRecord extends BasicRecord {
    seriousCount?: number,
    suspectedAddCount?: number,
    confirmedAddCount?: number,
    seriousAddCount?: number,
    curedAddCount?: number,
    deadAddCount?: number,
    country: string,
    continents: string,
}

export interface ProvinceRecord extends BasicRecord {

    country: string,
    province: string
}

export interface CityRecord extends BasicRecord {
    country: string,
    province: string,
    city: string,
}
export interface NCOVRecord {
    countries: CountryRecord[],
    provinces: ProvinceRecord[],
    cities: CityRecord[]
    rumors: Rumor[]
    newses: News[]
}

interface Rumor {

    title: string
    subTitle: string
    content: string
    recordAt: Date
}
interface News {

    title: string
    subTitle?: string
    content: string
    recordAt: Date
    infoSource: string
    province: string
    sourceUrl: string
}
const errorChar = '�'
const newsError = (a: News) => {
    return a.title.indexOf(errorChar) >= 0
        || a.content.indexOf(errorChar) >= 0
        || a.infoSource.indexOf(errorChar) >= 0
        || a.sourceUrl.indexOf(errorChar) >= 0
}
const rumorError = (a: Rumor) => {
    return a.title.indexOf(errorChar) >= 0
        || a.content.indexOf(errorChar) >= 0
        || a.subTitle.indexOf(errorChar) >= 0
}
const countryRecordError= (a: CountryRecord) => {
    return a.country.indexOf(errorChar) >= 0
        || a.continents.indexOf(errorChar) >= 0
}

const provinceRecordError= (a: ProvinceRecord) => {
    return a.country.indexOf(errorChar) >= 0
        || a.province.indexOf(errorChar) >= 0
}

const cityRecordError= (a: CityRecord) => {
    return a.country.indexOf(errorChar) >= 0
        || a.province.indexOf(errorChar) >= 0
        || a.city.indexOf(errorChar) >= 0
}
const recordToDB = (data: NCOVRecord, sourceUrl = 'https://ncov.dxy.cn/ncovh5/view/pneumonia') => {

    const photon = new PrismaClient();

    const toNews = (a: News) =>
        newsError(a)
            ? () => Promise.resolve(void 0)
            : pipe(
                () => photon.news.upsert({
                    where: { sourceUrl: a.sourceUrl },
                    create: a,
                    update: {

                    }
                }),
                Task.map(() => void 0)
            )

    const toRumor = ({ title, subTitle, content, recordAt }: Rumor) =>
    rumorError({ title, subTitle, content, recordAt })
    ? () => Promise.resolve(void 0)
    : pipe(
        () => photon.rumor.upsert({
            where: { title: title },
            create: {
                id: cuid(),
                title,
                subTitle,
                content,
                recordAt
            },
            update: {

            }
        }),
        Task.map(() => void 0)
    )
    const upsertCountryTask = (current: { country: string, continents?: string }) => pipe(
        () => photon.country.upsert({
            where: { id: current.country },
            create: {
                id: current.country,
                title: current.country,
                continents: current.continents,
                ...convertTitle({ title: current.country })
            },
            update: {
                continents: current.continents
            }
        })
    )
    const upsertProvinceTask = (current: ProvinceRecord) => () => photon.province.upsert({
        where: { id: current.province },
        create: {
            id: current.province,
            title: current.province,
            ...convertTitle({ title: current.country }),
            country: {
                connect: { title: current.country }
            }
        },
        update: {

        }
    })
    const upsertCityTask = (current: CityRecord) => () => photon.city.upsert({
        where: { id: current.city },
        create: {
            id: current.city,
            title: current.city,
            ...convertTitle({ title: current.country }),
            province: {
                connect: { title: current.province }
            }
        },
        update: {

        }
    })
    const toCountryDB = (current: CountryRecord) => {
        
        const country: Task.Task<any> = upsertCountryTask(current);

        const recordTask: Task.Task<any> = pipe(
            () => {

                return photon.countryRecord.findMany({
                    where: {
                        recordAt: { gte: getTodayBegin(current.recordAt), lte: getTodayEnd(current.recordAt) },
                        country: { id: { equals: current.country } },
                    }
                })
            },
            Task.chain(value => {

                const id = value.length > 0 ? value[0].id : undefined;
                if (id) {
                   
                    const update: Task.Task<any> = () => (value[0].recordAt < current.recordAt) ? photon.countryRecord.update({
                        where: { id: id },
                        data: {
                            ...pick(current, ['suspectedCount', 'confirmedCount',
                                'curedCount', 'deadCount', 'seriousCount', 'continents',
                                'suspectedAddCount', 'confirmedAddCount', 'curedAddCount',
                                'deadAddCount', 'seriousAddCount']),
                            recordAt: current.recordAt,
                            country: { connect: { id: current.country } },
                            sourceUrl,
                            virus: { connect: { id: 'cnov' } }
                        }
                    }) : Promise.resolve("")
                    return update;
                } else {
                    const create = () => photon.countryRecord.create({
                        data: {
                            ...pick(current, ['suspectedCount', 'confirmedCount',
                                'curedCount', 'deadCount', 'seriousCount', 'continents',
                                'suspectedAddCount', 'confirmedAddCount', 'curedAddCount',
                                'deadAddCount', 'seriousAddCount']),
                            recordAt: current.recordAt,
                            country: { connect: { id: current.country } },
                            sourceUrl,
                            virus: { connect: { id: 'cnov' } }
                        }
                    })
                    return pipe(
                        [country, create],
                        A.array.sequence(Task.taskSeq),
                    )
                }
            }))
        return countryRecordError(current)
        ? () => Promise.resolve(void 0)
        :recordTask

    }
    const toProvinceDB = (current: ProvinceRecord) => {

        const country: Task.Task<any> = upsertCountryTask(current)
        const province: Task.Task<any> = upsertProvinceTask(current)
        const virusRecord: Task.Task<any> = pipe(
            () => {
                return photon.provinceRecord.findMany({
                    where: {
                        recordAt: { gte: getTodayBegin(current.recordAt), lte: getTodayEnd(current.recordAt) },
                        province: { id: { equals: current.province } },
                        country: { id: { equals: current.country } },
                    }
                })
            },
            Task.chain(value => {

                const id = value.length > 0 ? value[0].id : undefined;
                if (id) {

                    const update: Task.Task<any> = () => value[0].recordAt <= current.recordAt ? photon.provinceRecord.update({
                        where: { id: id },
                        data: {
                            ...pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount']),
                            recordAt: current.recordAt,
                            country: { connect: { id: current.country } },
                            province: {
                                connect: { id: current.province }

                            },
                            sourceUrl,
                            virus: { connect: { id: 'cnov' } }
                        }
                    }) : Promise.resolve(('void 0') as any)
                    return update

                } else {
                    return pipe(
                        [country, province, () => photon.provinceRecord.create({
                            data: {
                                ...pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount']),
                                recordAt: current.recordAt,
                                country: { connect: { id: current.country } },
                                province: {
                                    connect: { id: current.province }

                                },

                                sourceUrl,
                                virus: { connect: { id: 'cnov' } }
                            }
                        })],
                        A.array.sequence(Task.taskSeq),

                    )
                }
            }))

        return provinceRecordError(current)
        ? () => Promise.resolve(void 0)
        :virusRecord
    }
    const toCityDB = (current: CityRecord) => {

        const country: Task.Task<any> = upsertCountryTask(current)
        const province: Task.Task<any> = upsertProvinceTask(current)
        const city: Task.Task<any> = upsertCityTask(current)
        const virusRecord: Task.Task<any> = pipe(
            () => {
                return photon.cityRecord.findMany({
                    where: {
                        recordAt: { gte: getTodayBegin(current.recordAt), lte: getTodayEnd(current.recordAt) },
                        city: { id: { equals: current.city } },
                        province: { id: { equals: current.province } },
                        country: { id: { equals: current.country } },
                    }
                })
            },
            Task.chain(value => {

                const id = value.length > 0 ? value[0].id : undefined;
                if (id) {

                    const update: Task.Task<any> = () => value[0].recordAt <= current.recordAt ? photon.cityRecord.update({
                        where: { id: id },
                        data: {
                            ...pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount']),
                            recordAt: current.recordAt,
                            country: { connect: { id: current.country } },
                            province: {
                                connect: { id: current.province }

                            },
                            city: {
                                connect: { id: current.city },
                            },
                            sourceUrl,
                            virus: { connect: { id: 'cnov' } }
                        }
                    }) : Promise.resolve(void 0)
                    return update

                } else {
                    const create = () => photon.cityRecord.create({
                        data: {
                            ...pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount']),
                            recordAt: current.recordAt,
                            country: { connect: { id: current.country } },
                            province: {
                                connect: { id: current.province }

                            },
                            city: {
                                connect: { id: current.city },
                            },
                            sourceUrl,
                            virus: { connect: { id: 'cnov' } }
                        }
                    })
                    return pipe(
                        [country, province, city, create],
                        A.array.sequence(Task.taskSeq),
                    )
                }
            }))

        return cityRecordError(current)
        ? () => Promise.resolve(void 0)
        :virusRecord
    }
    const toDB = (a: NCOVRecord): Task.Task<void> => {

        return pipe(
            [
                ...a.countries.map(toCountryDB),
                ...a.provinces.map(toProvinceDB),
                ...a.cities.map(toCityDB),
                ...a.newses.map(toNews),
                ...a.rumors.map(toRumor),
            ],
            A.array.sequence(Task.taskSeq),
            Task.chain(() => async () => await photon.disconnect())
        )
    }

  
  
    return toDB(data)
}
export default recordToDB