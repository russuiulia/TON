export const sendDocumentToChat = async (
  chat_id: string,
  documentUrl: string,
  caption?: string
): Promise<any> => {
  const url = `${import.meta.env.VITE_WORKER_URL}/send-document-to-chat`;
  const body = {
    chat_id,
    documentUrl,
    caption,
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
        `Failed to send document: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending document:', error);
    throw error;
  }
};
