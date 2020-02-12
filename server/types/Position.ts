import { objectType } from 'nexus'
export const Country = objectType({
    name: 'Country',
    definition(t) {
        t.model.id()
        t.model.title()
        t.model.provinces()
        t.model.continents()
        t.model.cuid()
        t.model.tags()
    },
})
export const Province = objectType({
    name: 'Province',
    definition(t) {
        t.model.id()
        t.model.title()
        t.model.country()
        t.model.cities()
        t.model.cuid()
        t.model.tags()
    },
})

export const City = objectType({
    name: 'City',
    definition(t) {
        t.model.id()
        t.model.title()
        t.model.province()
        t.model.areas()
        t.model.cuid()
        t.model.tags()
    },
})

export const Area = objectType({
    name: 'Area',
    definition(t) {
        t.model.id()
        t.model.title()
        t.model.city()
        t.model.cuid()
        t.model.tags()
    },
})