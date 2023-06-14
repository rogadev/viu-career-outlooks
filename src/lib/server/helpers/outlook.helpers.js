// DATA
import canadaOutlooks from '../data/LMIEO_22-24.js'
import { kv } from '@vercel/kv'

console.log('Parsing BC Outlooks')
const bcOutlooks = canadaOutlooks.filter(
  (/** @type {{ Province: string; }} */ outlook) => outlook.Province === 'BC'
)
console.log('BC Outlooks parsed')
console.log('uploading to kv')
for (const outlook of bcOutlooks) {
  console.log('uploading outlook', outlook.NOC_Code)
  await kv.set(outlook.NOC_Code, JSON.stringify(outlook))
}

// CACHE
// import outlooksCache from '../cache/outlooks'

// FETCH HEADER - API KEY
// const headers = new Headers()
// headers.append('USER_KEY', import.meta.env.VITE_GC_API_USER_KEY)

/**
 * Capitalizes the first letter of a string.
 * @param {String} string - The string to capitalize.
 * @returns The capitalized string.
 */
// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1)
// }

/**
 * Returns the outlook potential as a number from 0 to 3. 0 being undetermined, 1 being limited, 2 being fair, and 3 being good.
 * @param {String} potential - The outlook potential, represented as a string.
 * @returns The outlook potential as a number from 0 to 3.
 */
// const outlookNumber = (potential) => {
//   switch (potential) {
//     case 'good':
//       return 3
//     case 'moderate':
//       return 2
//     case 'limited':
//       return 1
//     default:
//       return 0
//   }
// }

/**
 * Gets the BC outlook data for a given NOC code.
 * @param {Number} noc - The NOC code to search for.
 * @returns outlook data related to the NOC code.
 */
// const getOutlook = async (noc) => {
//   const formattedNOC = `NOC_${noc}`
//   console.log('formattedNOC', formattedNOC)
//   // find outlook where "NOC_Code" equals the formatted NOC code
//   const outlook = outlooks.find(
//     (/** @type {{ NOC_Code: string; Province: string; }} */ outlook) =>
//       outlook.NOC_Code === formattedNOC
//   )
//   if (!outlook) throw new Error(`Outlook not found for NOC code ${noc}.`)
//   return refactorOutlookWithLogicalPotential(outlook)

//   // try {
//   //   let outlook = outlooksCache.get(noc)
//   //   if (!outlook) {
//   //     const response = await fetch(
//   //       `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=59&lang=en`,
//   //       {
//   //         headers: headers,
//   //       }
//   //     )
//   //     outlook = await response.json()
//   //     outlooksCache.set(noc, outlook)
//   //   }
//   //   outlook = refactorOutlookWithLogicalPotential(outlook)
//   //   return outlook
//   // } catch (error) {
//   //   /** @ts-ignore */
//   //   return new Error(error)
//   // }
// }

/**
 * The LMI-EO API uses a silly outlook potential rating schema where 0 is undetermined, 1 is good, 2 is limited, and 3 is fair. This function converts the outlook potential value to a more logical format. 3 is good, 2 is fair, 1 is limited, 0 is undetermined. Additionally adds a verbose description of the outlook potential.
 * @param {{ NOC_Code: string; "NOC Title": string; Outlook: string; "Employment Trends": string; "Release Date": string; Province: string; "Economic Region Code": string; "Economic Region Name": string; LANG: string; }} outlook - Contains the outlook data to fix (potential)
 * @returns The fixed outlook data with corrected potential value.
 */
// function refactorOutlookWithLogicalPotential(outlook) {
//   const potential = outlook?.Outlook
//   if (!potential) throw new Error('Outlook potential value not found.')
//   const newPotential = capitalizeFirstLetter(potential)
//   const updatedOutlook = {
//     noc: outlook['NOC_Code'],
//     title: outlook['NOC Title'],
//     potential: outlookNumber(potential),
//     outlook_verbose: newPotential,
//     trends: outlook['Employment Trends'],
//     date: outlook['Release Date'],
//     province: outlook['Province'],
//     economic_region_code: outlook['Economic Region Code'],
//     economic_region_name: outlook['Economic Region Name'],
//     lang: outlook['LANG'],
//   }
//   return updatedOutlook
// }

/**
 * Uses the LMI Employment Outlook API to query for the national outlook for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param {String} noc The NOC code of the relevant unit group.
 * @returns Array of outlook objects containing provincial code and "potential" metric. Potential describes outlook as a number from 0-3, 3 being best.
 */
// const fetchNationalOutlook = async (noc) => {
//   // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks/ca?noc=1111
//   return await fetch(
//     `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks/ca?noc=${noc}`,
//     { headers: headers }
//   )
// }

/**
 * Uses the LMI Employment Outlook API to query for the provincial outlook for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param {String} noc The NOC code of the relevant unit group.
 * @param {String} provinceId The province code relevant to this search.
 * @returns Object containing key value pairs of data related to the outlook of the given unit group in the given province.
 */
// const fetchProvincialOutlook = async (noc, provinceId) => {
//   // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10

//   try {
//     const response = await fetch(
//       `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=${noc}&rtp=1&rid=${provinceId}&lang=en`,
//       { headers: headers }
//     )
//     const data = await response.json()
//     return data
//   } catch (e) {
//     console.error(e)
//   }
// }

/**
 * Verifies an outlook potential value form 0 to 3.
 * @param {Number} potential - The outlook potential, represented as a value from 0 to 3.
 * @returns The verbose description of the outlook potential.
 */
// const verbifyOutlookValue = (potential) => {
//   switch (Number(potential)) {
//     case 1:
//       return 'Limited'
//     case 2:
//       return 'Fair'
//     case 3:
//       return 'Good'
//     default:
//       return 'Undetermined'
//   }
// }

// export { getOutlook, refactorOutlookWithLogicalPotential }
