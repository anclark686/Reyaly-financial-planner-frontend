import Axios from "axios";

import { type Data } from "../types";
import { type Dataless } from "../types";
import { type Created } from "../types";
import { type Account } from "../types";

const baseUrl = "http://127.0.0.1:3000";

export const getUserInfo = (authUID: String | undefined): Promise<Data> => {
  return Axios.get(`${baseUrl}/users/?uid=${authUID}`).then((res) => res.data);
};

export const sendJson = (data: {}, id: string): Promise<Dataless> => {
  return Axios.post(`${baseUrl}/users/${id}/download`, data).then((res) => res.data);
};

export const addAcct = (dbUserId: string, data: Account): Promise<Created> => {
  return Axios.post(`${baseUrl}/users/${dbUserId}/accounts`, data).then((res) => res.data);
};

export const editAcct = (dbUserId: string, data: Account): Promise<any> => {
  return Axios.put(`${baseUrl}/users/${dbUserId}/accounts/${data.id}`, data)
              .then((res) => res.data);
};

export const deleteAcct = (dbUserId: string, id: string): Promise<Dataless> => {
  return Axios.delete(`${baseUrl}/users/${dbUserId}/accounts/${id}`).then((res) => res.data);
};
