import {en} from './en'
import {zhCn} from './zhCn'
import {cs} from './cs'
import {ja} from './ja'
import {config} from "../consts";

const ui = {
  en,
  ja,
  'zh-cn':zhCn,
  cs
}


export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    return ui[lang][key] || ui[config.lang][key];
  }
}

// @ts-ignore
export const t = useTranslations(config.lang)

