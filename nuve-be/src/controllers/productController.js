import manFashion from '../manFashion.json' with { type: 'json' }
import womanFashion from '../womanFashion.json' with { type: 'json' }

const getAllProductsArray = () => {
  return [
    ...manFashion.top,
    ...manFashion.down,
    ...manFashion.footwear,
    ...womanFashion.top,
    ...womanFashion.down,
    ...womanFashion.footwear,
  ]
}

export function listProducts(req, res) {
  const { gender } = req.query

  if (gender === 'man') {
    return res.json(manFashion)
  } else if (gender === 'woman') {
    return res.json(womanFashion)
  }

  const allProducts = {
    man: manFashion,
    woman: womanFashion,
  }
  return res.json(allProducts)
}

export function getProductById(req, res) {
  const { id } = req.params
  if (!id) return res.status(400).json({ error: 'Parameter "id" diperlukan' })

  const allProducts = getAllProductsArray()
  const product = allProducts.find((p) => p.id && p.id.toLowerCase() === id.toLowerCase())
  if (product) return res.json(product)

  return res.status(404).json({ error: 'Produk tidak ditemukan' })
}
