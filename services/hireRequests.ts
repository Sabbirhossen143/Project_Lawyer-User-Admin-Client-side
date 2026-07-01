import axios from "axios";

export const createRequest =
  async (data: any) => {
    const res = await axios.post(
      "http://localhost:5000/hire-requests",
      data
    );

    return res.data;
  };

export const getRequests =
  async () => {
    const res = await axios.get(
      "http://localhost:5000/hire-requests"
    );

    return res.data;
  };

  export const deleteRequest = async (
  id: string
) => {
  const res = await axios.delete(
    `http://localhost:5000/hire-requests/${id}`
  );

  return res.data;
};

  export const updateRequestStatus =
  async (
    id: string,
    status: string
  ) => {
    const res = await axios.patch(
      `http://localhost:5000/hire-requests/${id}`,
      { status }
    );

    return res.data;
  };

  export const getUserRequests =
  async (email: string) => {

    const res =
      await axios.get(
        `http://localhost:5000/hire-requests/user/${email}`
      );

    return res.data;
  };

  export const getLawyerRequests = async (
  email: string
) => {

  const res = await axios.get(
    `http://localhost:5000/hire-requests/lawyer/${email}`
  );

  return res.data;

};
