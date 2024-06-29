const apiUrl = "http://localhost:3000"

export const ApiEndpoints = {
    Auth: {
        Register: `${apiUrl}/auth/signup`,
        Login: `${apiUrl}/auth/signin`,
        Profile: `${apiUrl}/user/profile`,
    }
}
export const LocalStorage = {
    token: "USER_TOKEN"
}

