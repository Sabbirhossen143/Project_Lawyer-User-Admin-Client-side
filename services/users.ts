import axiosPublic from "@/lib/axios";

export const updateUser = async (
  email: string,
  data: any
) => {
  const res = await axiosPublic.patch(
    `/users/${email}`,
    data
  );

  return res.data;
};