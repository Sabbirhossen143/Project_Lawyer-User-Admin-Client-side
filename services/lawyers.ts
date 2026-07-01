import axiosPublic from "@/lib/axios";

export const getLawyers = async () => {
  const res = await axiosPublic.get(
    "/lawyers"
  );

  return res.data;
};

export const getLawyerByEmail = async (
  email: string
) => {
  const res = await axiosPublic.get(
    `/lawyers/email/${email}`
  );

  return res.data;
};

export const updateLawyer = async (
  id: string,
  data: any
) => {
  const res = await axiosPublic.patch(
    `/lawyers/${id}`,
    data
  );

  return res.data;
};