import axios from "axios";
import axiosPublic from "@/lib/axios";

export const createComment = async (commentData: any) => {
  const res = await axiosPublic.post(
    "/comments",
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

export const getCommentsByLawyer = async (lawyerId: string) => {
  const res = await axiosPublic.get(
    `/comments/lawyer/${lawyerId}`
  );
  return res.data;
};

export const getMyComments = async (email: string) => {
  const res = await axiosPublic.get(
    `/comments/user/${email}`
  );
  return res.data;
};

export const deleteComment = async (id: string) => {
  const res = await axiosPublic.delete(
    `/comments/${id}`
  );
  return res.data;
};

export const updateComment = async (
  id: string,
  comment: string
) => {
  const res = await axiosPublic.patch(
    `/comments/${id}`,
    { comment }
  );
  return res.data;
};