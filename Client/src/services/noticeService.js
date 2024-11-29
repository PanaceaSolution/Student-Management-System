const URL = import.meta.env.VITE_API_URL;


export const getNoticeService = async () => {
  const response = await fetch(`${URL}/notices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return response.json();
}

export const createNoticeService = async (noticeData) => {
  const response = await fetch(`${URL}/notices/create`, {
    method: "POST",
    credentials: "include",
    body: noticeData,
  });

  return response.json();
};

export const deleteNoticeService = async (noticeId) => {
  const response = await fetch(`${URL}/notices/delete/${noticeId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  return data;
}
