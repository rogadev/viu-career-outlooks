/**
 * Shadow Endpoing - handles getting job outlook data for a given NOC code. Querries our express api, proxys to the LMI-EO api, and returns the data.
 * @param {*} param0
 */
export async function GET({ params }) {
  const noc = Number(params.noc)

  return {
    status: 200,
    body: {
      title: noc,
    },
  }
}
