import { PrismaClient } from '@prisma/client'
import * as Task from 'fp-ts/lib/Task'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import { pick } from 'macoolka-object'
import * as dateFns from 'date-fns';
import { isString } from 'macoolka-predicate'
import { async } from 'rxjs/internal/scheduler/async'
import {convertTitle} from './dataHelpler'
const photon = new PrismaClient();
const updateAll=()=>{
    const countries=pipe(
        ()=>photon.country.findMany(),
        Task.chain(as=>pipe(
            as,
            A.map(a=>()=>photon.country.update({where:{id:a.id},data:convertTitle(a)})),
            A.array.sequence(Task.task)
        ))
    )
    const provinces=pipe(
        ()=>photon.province.findMany(),
        Task.chain(as=>pipe(
            as,
            A.map(a=>()=>photon.province.update({where:{id:a.id},data:convertTitle(a)})),
            A.array.sequence(Task.taskSeq)
        ))
    )
    const cites=pipe(
        ()=>photon.city.findMany(),
        Task.chain(as=>pipe(
            as,
            A.map(a=>()=>photon.city.update({where:{id:a.id},data:convertTitle(a)})),
            A.array.sequence(Task.taskSeq)
        ))
    )
    return pipe(
        ()=>photon.connect(),
        Task.chain(()=>pipe(
            [countries,provinces,cites],
            A.array.sequence(Task.taskSeq)
        ))
       
    )

}

updateAll()().then(()=>{
    console.log('ok')
}).finally(()=>{
    photon.disconnect()
})