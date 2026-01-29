import http from "./http";

export const checkInApi = async ({ selfieFile, lat, lng }) => {
  const form = new FormData();
  form.append("selfie", selfieFile);
  form.append("lat", String(lat));
  form.append("lng", String(lng));

  const res = await http.post("/attendance/checkin", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
