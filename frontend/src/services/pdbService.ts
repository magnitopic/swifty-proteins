import api from './client';


export const getPdb = async (ligandId: string) => {

  const response = await api.get(`/api/v1/pdb/${ligandId}`);
  return response.data;
};