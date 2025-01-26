export const sendPreorderToChat = async (
  chat_id: string | undefined,
  text: string,
  inline_keyboard_text: string,
  orderId: string,
  WEB_APP_URL: string
): Promise<any> => {
  const url = `${import.meta.env.VITE_WORKER_URL}/send-preorder-link-to-chat`;
  const body = {
    chat_id,
    text,
    inline_keyboard_text,
    orderId,
    WEB_APP_URL,
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
        `Failed to send preorder message: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending preorder message:', error);
    throw error;
  }
};
