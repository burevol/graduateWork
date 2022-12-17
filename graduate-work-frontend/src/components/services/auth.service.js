import axios from "axios";

const API_URL = "http://localhost:8000/";

const register = (username, email, password) => {
    return axios.post(API_URL + "register", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "login/", {
            username,
            password,
        })
        .then((response) => {

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    return axios.post(API_URL + "logout/",).then((response) => {

        return response.data;
    })

};

const userToProfile = (id) => {
    return axios.get(API_URL + `api/usertoprofile?user_id=${id}`,).then((response) => {
        return response.data;
    })
};

const authService = {
    register,
    login,
    logout,
    userToProfile
};

export default authService;