export async function get() {
  // Fetch from our heroku api.
  return {
    status: 200,
    body: {
      title: 'Careers',
    },
  }
}
