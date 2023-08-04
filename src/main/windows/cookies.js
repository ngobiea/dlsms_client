const { session } = require('electron');

let ses = session.defaultSession;
const getCookies = () => {
  const cookies = ses.cookies
    .get({})
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
  return cookies;
};
const isSetCookie = (data) => {
  const result = ses.cookies
    .get({ name: data })
    .then((cookies) => {
      if (cookies.length !== 0) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return result;
};
const getCookie = (data) => {
  const result = ses.cookies
    .get({ name: data })
    .then((cookies) => {
      // console.log(cookies);
      return cookies;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
  return result;
};

const setCookies = (data) => {
  ses.cookies
    .set(data)
    .then((result) => {})
    .catch((err) => {
      console.log(err);
    });
};
const removeCookies = (url, name) => {
  ses.cookies
    .remove(url, name)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};
module.exports = {
  getCookies,
  setCookies,
  removeCookies,
  isSetCookie,
  getCookie,
};
