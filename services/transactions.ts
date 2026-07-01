import axios from "axios";

export const createTransaction =
  async (data: any) => {

    const res =
      await axios.post(
        "http://localhost:5000/transactions",
        data
      );

    return res.data;
};

export const getTransactionsByLawyer =
  async (email: string) => {

    const res =
      await axios.get(
        `http://localhost:5000/transactions/lawyer/${email}`
      );

    return res.data;
};

export const getTransactionsByUser =
  async (email: string) => {

    const res =
      await axios.get(
        `http://localhost:5000/transactions/user/${email}`
      );

    return res.data;
};