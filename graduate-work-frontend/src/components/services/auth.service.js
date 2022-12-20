import axios from "axios";

const API_URL = "http://localhost:8000/";

const register = (username, email, password, phone) => {
    return axios.post(API_URL + "register/", {
        username: username,
        email: email,
        password1: password,
        password2: password,
        phone_number: phone,
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

const authService = {
    register,
    login,
    logout,
};

export default authService;