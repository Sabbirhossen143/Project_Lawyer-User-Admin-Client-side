import axios from "axios";
import axiosPublic from "@/lib/axios";

export const createComment =
async (
  commentData: any
) => {

  const res =
    await axios.post(
      "http://localhost:5000/comments",
      commentData
    );

  return res.data;
};

export const getUserComments =
  async (email: string) => {

    const res =
      await axiosPublic.get(
        `/comments/user/${email}`
      );

    return res.data;
};

export const getCommentsByLawyer =
  async (lawyerId: string) => {

    const res =
      await axios.get(
        `http://localhost:5000/comments/lawyer/${lawyerId}`
      );

    return res.data;
};

export const getMyComments =
  async (email: string) => {

    const res =
      await axios.get(
        `http://localhost:5000/comments/user/${email}`
      );

    return res.data;
};

export const deleteComment =
  async (id: string) => {

    const res =
      await axios.delete(
        `http://localhost:5000/comments/${id}`
      );

    return res.data;
};

export const updateComment =
  async (
    id: string,
    comment: string
  ) => {

    const res =
      await axios.patch(
        `http://localhost:5000/comments/${id}`,
        { comment }
      );

    return res.data;
};