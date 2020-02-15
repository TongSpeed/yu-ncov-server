
import cuid from 'cuid'
import { pinyinFullString } from '../chinese'
export const convertTitle = (a: { title: string }) => ({
  
    cuid: cuid(),
    tags: pinyinFullString(a.title)
})