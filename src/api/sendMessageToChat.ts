export const sendMessageToChat = async (
  chat_id: string | undefined,
  text?: string
): Promise<any> => {
  const url = `${process.env.REACT_APP_WORKER_URL}/send-message-to-chat`;
  const body = {
    chat_id,
    text,
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
        `Failed to send message: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
