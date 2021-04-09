

export const handler = async (event: any) => {

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify([{ a: 'c' }]),
  }
}
