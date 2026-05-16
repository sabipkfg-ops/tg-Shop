import { Lang } from '@/types'

const translations = {
  ru: {
    catalog: 'Каталог',
    favorites: 'Избранное',
    all: 'Все',
    pants: 'Штаны',
    bags: 'Сумки',
    jackets: 'Куртки',
    hoodies: 'Худи/Зипки',
    filters: 'Фильтры',
    write: 'Написать',
    clothingSize: 'Размер одежды',
    shoeSize: 'Размер обуви',
    sort: 'Сортировка',
    cheapFirst: 'Дешевле',
    expFirst: 'Дороже',
    apply: 'Применить',
    reset: 'Сбросить',
    emptyCatalog: 'Товаров нет',
    emptyFavorites: 'Избранное пусто',
    category_PANTS: 'Штаны',
    category_BAGS: 'Сумки',
    category_JACKETS: 'Куртки',
    category_HOODIES: 'Худи / Зипки',
  },
  en: {
    catalog: 'Catalog',
    favorites: 'Favorites',
    all: 'All',
    pants: 'Pants',
    bags: 'Bags',
    jackets: 'Jackets',
    hoodies: 'Hoodies',
    filters: 'Filters',
    write: 'Message',
    clothingSize: 'Clothing size',
    shoeSize: 'Shoe size',
    sort: 'Sort',
    cheapFirst: 'Cheapest',
    expFirst: 'Most expensive',
    apply: 'Apply',
    reset: 'Reset',
    emptyCatalog: 'No products',
    emptyFavorites: 'No favorites yet',
    category_PANTS: 'Pants',
    category_BAGS: 'Bags',
    category_JACKETS: 'Jackets',
    category_HOODIES: 'Hoodies / Zips',
  },
} as const

export type TKey = keyof typeof translations.ru

export function t(lang: Lang, key: TKey): string {
  return translations[lang][key] ?? key
}
