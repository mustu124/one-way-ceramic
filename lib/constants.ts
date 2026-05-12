export const BUSINESS = {
  name: 'One Way Ceramic Studio',
  shortName: 'One Way Ceramic',
  locationLine: 'Studio · Ahmedabad',
  address: '2G52+5R4, Noorani Rd, Prahlad Nagar, Ahmedabad, Gujarat 380015',
  phoneDisplay: '+91 84456 18578',
  phoneTel: '+918445618578',
  whatsapp: '918445618578',
  rating: '4.7',
  reviews: '70+',
  mapSrc:
    'https://maps.google.com/maps?q=One+Way+Ceramic+studio+Prahlad+Nagar+Ahmedabad&output=embed'
}

export const FALLBACK_SETTINGS = {
  announcement_text: 'Handcrafted in India · Bulk Orders Welcome · New Arrivals Every Week',
  offer_text: 'CLEARANCE OFFER - Upto 50% sitewide · Bulk discounts available · WhatsApp us for pricing'
}

export const CATEGORY_META = [
  { name: 'Drinkware', slug: 'drinkware', folder: 'drinkware', subs: ['Mugs', 'Cups', 'Cups & Saucers', 'Kettle Set', 'Glasses'] },
  { name: 'Serveware', slug: 'serveware', folder: 'serveware', subs: ['Plates', 'Serving Set', 'Bowls', 'Platter'] },
  { name: 'Dinnerware', slug: 'dinnerware', folder: 'dinnerware', subs: ['Dinner Set'] },
  { name: 'Kitchenware', slug: 'kitchenware', folder: 'kitchenware', subs: ['Jars & Containers', 'Oil Bottles'] },
  { name: 'Home Décor', slug: 'homedecor', folder: 'homedecor', subs: ['Pots', 'Vases', 'Decor Finds'] },
  { name: 'Bathware', slug: 'bathware', folder: 'bathware', subs: ['Bath Accessories', 'Soap Dispensers'] }
]

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const folderify = (value: string) => slugify(value).replace(/-/g, '_')
