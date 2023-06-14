import { loading } from '$lib/stores/loading'
import { error } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'

// LOCAL DATA
import unitGroups from '$lib/server/data/noc_2016_unit_groups.json'

// PRISMA
const prisma = new PrismaClient()

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
function outlookNumber(/** @type string*/ outlook) {
  switch (outlook) {
    case 'very limited':
      return 1
    case 'limited':
      return 2
    case 'moderate':
      return 3
    case 'good':
      return 4
    case 'very good':
      return 5
    default:
      return 0
  }
}

// -------------------- LOAD FUNCTION --------------------
export async function load({ params }) {
  loading.set(true)
  const noc = String(params.noc)
  if (!noc) throw error(404, 'NOC parameter was not provided.')
  const unitGroup = unitGroups.find(
    (unitGroup) => unitGroup.noc === noc ?? false
  )
  if (!unitGroup) throw error(404, `No unit group found for NOC: ${noc}`)

  const fetchedOutlook = await prisma.outlook.findFirst({
    where: {
      noc: `NOC_${noc}`,
    },
  })

  if (!fetchedOutlook) {
    throw error(404, `No outlook found for NOC: ${noc}`)
  }

  const outlook = {
    status: 200,
    noc,
    title: unitGroup.title,
    jobs: unitGroup.jobs,
    requirements: unitGroup.requirements,
    duties: unitGroup.duties,
    outlook: outlookNumber(fetchedOutlook.outlook),
    outlook_verbose: fetchedOutlook.outlook,
    trends: fetchedOutlook.trends,
    province: 'British Columbia',
  }

  loading.set(false)
  return outlook
}
