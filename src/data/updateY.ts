import { PrismaClient } from '@prisma/client'
import * as A from 'fp-ts/lib/Array'
import * as Task from 'fp-ts/lib/Task'
import { pipe } from 'fp-ts/lib/pipeable'
import {ordDate,contramap} from 'fp-ts/lib/Ord'
const ordRecordAt=contramap(({recordAt}:BasicRecord)=>recordAt)(ordDate)
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
}

export const add = <T extends object>(keys: Array<keyof T>) => ([a, b]: [T, T]): any => pipe(
    keys,
    A.reduce({}, (result, key) => ({
        ...result,
        [key + 'Y']: Number(b[key]),
    }))
)
export const toVirusRecords = (as1: BasicRecord[]): BasicRecord[] => {
    if (as1.length >= 2) {
        return pipe(
            as1,
            A.sort(ordRecordAt),
            A.reverse,
            (as)=>A.zip(as, [...as.slice(1), {deadCount:0,suspectedCount:0,confirmedCount:0,curedCount:0,recordAt:new Date()} as BasicRecord]),
            A.map(([a, b]) => ({
                ...a,
                ...add<BasicRecord>(['deadCount', 'suspectedCount', 'confirmedCount', 'curedCount'])([a, b])
            }))
        )
    } else if (as1.length === 1) {
        return add<BasicRecord>(['deadCount', 'suspectedCount', 'confirmedCount', 'curedCount'])([as1[0], {deadCount:0,suspectedCount:0,confirmedCount:0,curedCount:0} as BasicRecord])
    } else {
        return []
    }
}
const photon = new PrismaClient();

const recordToDB = () => {
    return pipe(
        ()=> photon.country.findMany(),
        Task.map(countries=> pipe(
            countries,
            A.map(a=>{
                console.log(a)
            }
               
                
            )
        ))
    )
 
  
   
}
recordToDB()().then(()=>{
    console.log('ok')
}).finally(()=>{
    photon.disconnect()
})