import menuData from './menu.json'

const imageModules = import.meta.glob('../assets/images/*.jpeg', {
  eager: true,
  import: 'default',
  query: '?url',
})

const imagesByName = Object.fromEntries(
  Object.entries(imageModules).map(([path, imageUrl]) => [
    path.split('/').pop(),
    imageUrl,
  ]),
)

const menuItems = menuData.map((item) => {
  const image = imagesByName[item.image]
  if (!image) throw new Error(`Foto menu tidak ditemukan: ${item.image}`)
  return { ...item, image }
})

export default menuItems
