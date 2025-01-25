export const getOffers = async (
  vehicle: string,
  duration: number,
  region: string,
  idnx: string
): Promise<any> => {
  const url = `${process.env.REACT_APP_WORKER_URL}/get-offers`;
  const body = {
    product: 'green-card',
    region,
    duration,
    vehicle,
    idnx,
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
        `Failed to fetch offers: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error; 
  }
};
