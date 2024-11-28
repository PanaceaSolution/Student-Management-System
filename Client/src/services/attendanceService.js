const URL = import.meta.env.VITE_API_URL;

export const saveAttendenceService = async (attendenceData) => {
   try {
      console.log("Sending attendenceData:", attendenceData); // Log the data being sent
      const response = await fetch(`${URL}/attendence/save`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify(attendenceData),
      });
      const data = await response.json();
      console.log("response", data);
      return data;
   } catch (error) {
      console.error("Error while submitting the attendence", error);
      return { success: false, error };
   }
};