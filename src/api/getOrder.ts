export const getOrder = async (id: string): Promise<any> => {
  const url = `${process.env.REACT_APP_WORKER_URL}/get-order`;
  const body = {
    id,
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch order: ${response.status} ${response.statusText}`
      );
    }

    return await response.json(); // Parse and return the JSON object
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error; // Re-throw the error for further handling
  }
};
