import React from 'react';
import GoogleLogin from '@leecheuk/react-google-login';
import googleLogin from "./services/googleLogin";

function GoogleSocialAuth() {

    const responseGoogle = async (response) => {
        let googleResponse = await googleLogin(response.accessToken)
        console.log(googleResponse);
        console.log(response);
    }

    return (
        <div className="App">
            <h1>LOGIN WITH GOOGLE</h1>

            <GoogleLogin
                clientId="5299415701-v4k6hbeontp98bklokhf4q17do396nua.apps.googleusercontent.com"
                buttonText="LOGIN WITH GOOGLE"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
            />
        </div>
    );
}

export default GoogleSocialAuth;