import fetch from '/@/api/fetch';
export const FetchPost = (url: string, params?: any) => {
  return new Promise((resolve) => {
    return fetch.post(url, params).then((res) => {
      resolve(res.data);
    });
  });
};

export const FetchGet = (url: string, params?: any) => {
  return new Promise((resolve) => {
    return fetch.get(url, params).then((res) => {
      resolve(res);
    });
  });
};
