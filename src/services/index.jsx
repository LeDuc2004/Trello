let Api = process.env.REACT_APP_API_BASE

export async function getData(endpoint) {
  try {
    const response = await fetch(`${Api+endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function postData(endpoint, data, authorization) {
  try {
    let header = {
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      header = {
        ...header,
        authorization: authorization,
      };
    }

    const response = await fetch(`${Api+endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data ?? {}),
      headers: header,
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error posting data:', error);
  }
}

export async function putData(endpoint, data) {
  try {
    const response = await fetch(`${Api+endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error putting data:', error);
  }
}

export async function deleteData(endpoint) {
  try {
    const response = await fetch(`${Api+endpoint}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}
