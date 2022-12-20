import axios from "axios";

/**
 *
 * @param {*} accesstoken This is the accesstoken of the user obtained from Google
 */
const googleLogin = async (accesstoken) => {
    let res = await axios.post(
      "http://localhost:8000/login/google/",
      {
        access_token: accesstoken,
      }
    ).then((res) => {
        console.log(res)
        return res.status;
    })

  };

export default googleLogin;