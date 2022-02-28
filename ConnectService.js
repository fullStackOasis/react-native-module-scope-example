// This service is buggy. The retryCount is set once when the module loads,
// and then gets incremented willy-nilly.
// Server retry variables
let retryCount = 0;
console.log("ConnectService file is loading... retryCount is " + retryCount);
const MAX_RETRY = 5;
const RETRY_TIMEOUT = 2000;
const API_URL = "https://jsonplaceholder.typicode.com";
/**
 * Retries a fetch to the server, and fails after a set number of retries above
 * @param {*} url
 * @param {*} req
 * @param {*} source
 * @param {*} retryCount
 * @return Promise
 */
const fetchRetry = (url, req, source) =>
  new Promise((resolve, reject) => {
    retryCount++;

    console.log('ConnectService retry count: ' + retryCount +
      " source " + source +  ` url: ${API_URL}/${url}`);
    if(retryCount === 4) {
      console.log( 'Toast message from connect timeout 4th try:', source, ' url:', url );
    }

    const fetchStart = new Date();
    console.log('Attempt fetch from source:', source ,' at url: ', `${API_URL}/${url}`);
    fetch(`${API_URL}/${url}`, req)
      .then(res => {
        console.log(
          `Fetch time ${url}: source:${source}`,
          new Date() - fetchStart
        );
        retryCount = 1;
        if (res?.status >= 400) {
          console.error("fetchRetry failed on " + url);
        }
        resolve(res);
      })
      .catch(error => {
        setTimeout(
          () => {
            if (retryCount <= MAX_RETRY) {
              console.log(`Retrying connection ${retryCount} times... `);

              let fetchRetryStart = new Date();
              fetchRetry(url, req, source, retryCount)
                .then(res => {
                  console.log(
                    `FetchRetry time ${API_URL}/${url}: source:${source}`,
                    new Date() - fetchRetryStart
                  );
                  retryCount = 0;
                  resolve(res);
                })
                .catch(err => {
                  console.log(`Connection Failed - error ${err} for url:${API_URL}/${url}`);
                  reject(false);
                });
            } else {
              console.log('SHOULD REJECT CALL');
              reject(error);
            }
          },
          retryCount ? RETRY_TIMEOUT * retryCount : RETRY_TIMEOUT

        );
      });
  });

// Default fetch data function
const fetchData = async ({ url, payload, token, headers, method, source }) => {
  let req = {
    method: method ? method : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  };

  // Append body if payload is passed
  if (payload) {
    const body = { body: payload };
    req = Object.assign({ ...req }, body);
  }

  retryCount = 0;
  // const data = await fetchRetry(url, req, source, retryCount);
  const data = await fetchRetry(url, req, source);
  return await data.json();
};


const updateUser = async (id, payload, source) => {
  let res = await fetchData({
    url: "todos/1",
    payload,
    method: 'GET',
    source: source
  });
  return res;
};

const updateUser2 = async (id, payload, source) => {
  let res = await fetchData({
    url: "todos/2",
    payload,
    method: 'GET',
    source: source
  });
  return res;
};

export default {
  fetchData,
  updateUser,
  updateUser2
};