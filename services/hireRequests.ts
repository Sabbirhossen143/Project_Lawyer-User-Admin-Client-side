import axiosPublic from "@/lib/axios";

export const createRequest = async (data: any) => {
  const res = await axiosPublic.post(
    "/hire-requests",
    data
  );
  return res.data;
};

export const getRequests = async () => {
  const res = await axiosPublic.get(
    "/hire-requests"
  );
  return res.data;
};

export const deleteRequest = async (id: string) => {
  const res = await axiosPublic.delete(
    `/hire-requests/${id}`
  );
  return res.data;
};

export const updateRequestStatus = async (
  id: string,
  status: string
) => {
  const res = await axiosPublic.patch(
    `/hire-requests/${id}`,
    { status }
  );
  return res.data;
};

export const getUserRequests = async (
  email: string
) => {
  const res = await axiosPublic.get(
    `/hire-requests/user/${email}`
  );
  return res.data;
};

export const getLawyerRequests = async (
  email: string
) => {
  const res = await axiosPublic.get(
    `/hire-requests/lawyer/${email}`
  );
  return res.data;
};