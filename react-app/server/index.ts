import renderSsrApp from './renderSsrApp';

const handler = async function(event: any) {
  console.log('react server handle event', JSON.stringify(event, null, 2));

  const app = renderSsrApp();

  const body = `
<!DOCTYPE html>
<html>
  <body>
    <div id="root">${app}</div>
  </body>
</html>
  `

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body,
  }
}

export {
  handler
}
