import { api } from "./api";

export const getUsers = async () => {
    const res = await api.get("/users");
    return res.data;
};

export const createItem = async (data: any) => {
    const res = await api.post("/items", data);
    return res.data;
};
