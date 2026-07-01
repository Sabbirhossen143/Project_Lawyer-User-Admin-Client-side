import axiosPublic from "@/lib/axios";

export const getLawyer = async (
  id: string
) => {
  const res = await axiosPublic.get(
    `/lawyers/${id}`
  );

  return res.data;
};

export const getLawyers =
  async () => {

    const res =
      await axiosPublic.get(
        "/lawyers"
      );

    return res.data;
};