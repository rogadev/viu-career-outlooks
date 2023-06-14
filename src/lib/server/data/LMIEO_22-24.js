import data from './outlooks.json' assert { type: 'json' }
import { PrismaClient } from '@prisma/client'

/**
 * @typedef {Object} Outlook
 * @property {String} noc - The National Occupational Classification (NOC) code.
 * @property {String} title - The title of the outlook.
 * @property {String} outlook - The outlook information.
 * @property {String} trends - The trends information.
 * @property {Date} date - The date of the outlook.
 * @property {String} province - The province associated with the outlook.
 * @property {String} economic_region_code - The economic region code.
 * @property {String} economic_region_name - The economic region name.
 */

const prisma = new PrismaClient()

async function main() {
  const jsonData = JSON.stringify(data)
  const allOutlooks = await JSON.parse(jsonData)
  const /** @type Outlook[] */ bcOutlooks = []

  allOutlooks.forEach((/** @type Outlook */ outlook) => {
    if (outlook.province === 'BC') {
      bcOutlooks.push(outlook)
    }
  })

  await prisma.outlook.createMany({
    data: bcOutlooks,
  })

  console.log('complete')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
