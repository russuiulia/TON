export const createOrder = async (
  start_date: string,
  vehicle: string,
  duration: number,
  region: string,
  idnx: string,
  insurance_company: string,
  tguid: number | undefined
): Promise<any> => {
  const url = `${process.env.REACT_APP_WORKER_URL}/create-order`;
  const body = {
    customer: {
      name: 'John Doe',
      email: '',
      phone: '+37379000000',
    },
    products: [
      {
        product: 'green-card',
        vehicle,
        start_date,
        duration,
        region,
        insurance_company,
        idnx,
      },
    ],
    tguid: tguid?.toString(),
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
        `Failed to create order: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
