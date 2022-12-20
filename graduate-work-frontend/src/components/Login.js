import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import {Spinner, Alert} from "flowbite-react";
import {Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from "yup";

import {login} from "./store/auth";
import {clearMessage} from "./store/message";
import GoogleSocialAuth from "./GoogleSocialAuth";

const Login = () => {
    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {isLoggedIn} = useSelector((state) => state.storageData.auth);
    const {message} = useSelector((state) => state.storageData.message);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("This field is required!"),
        password: Yup.string().required("This field is required!"),
    });

    const handleLogin = (formValue) => {
        const {username, password} = formValue;
        setLoading(true);

        dispatch(login({username, password}))
            .unwrap()
            .then(() => {
                navigate("/profile");
                //window.location.reload();
            })
            .catch(() => {
                setLoading(false);
            });
    };

    if (isLoggedIn) {
        return <Navigate to="/profile"/>;
    }

    return (
        <div className="container max-w-sm px-4">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                <Form>

                    <label htmlFor="username"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <Field name="username" type="text"
                           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
                    <ErrorMessage
                        name="username"
                        component="div"
                        className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    />

                    <div className="form-group">
                        <label htmlFor="password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <Field name="password" type="password"
                               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-10 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                disabled={loading}>
                            {loading && (
                                <Spinner aria-label="Default status example"/>
                            )}
                            <span>Login</span>
                        </button>
                    </div>
                </Form>
            </Formik>
            <GoogleSocialAuth/>
            {message && (
                <Alert
                    color="failure">
                    {message}
                </Alert>
            )}
        </div>
    );
};

export default Login;