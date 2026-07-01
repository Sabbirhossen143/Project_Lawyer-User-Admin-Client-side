import axiosPublic from "@/lib/axios";

export const createTransaction = async (data: any) => {
  const res = await axiosPublic.post(
    "/transactions",
    data
  );
  return res.data;
};

export const getTransactionsByLawyer = async (
  email: string
) => {
  const res = await axiosPublic.get(
    `/transactions/lawyer/${email}`
  );
  return res.data;
};

export const getTransactionsByUser = async (
  email: string
) => {
  const res = await axiosPublic.get(
    `/transactions/user/${email}`
  );
  return res.data;
};