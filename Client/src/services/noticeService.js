const URL = import.meta.env.VITE_API_URL;

export const createNoticeService = async (noticeData) => {
  const response = await fetch(`${URL}/notices/create`, {
    method: "POST",
    credentials: "include",
    body:noticeData,
  });

  console.log("Response", response);
  return response.json();
};
