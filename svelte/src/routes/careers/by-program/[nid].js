export async function GET() {
  // Fetch from our heroku api.
  return {
    status: 200,
    body: {
      title: 'Careers',
    },
  }
}
