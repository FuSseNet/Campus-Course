import UrlBuilder from "./api.js";
const userState = async () =>{
    const user = {
        email: null,
        fullName: null,
        birthday: new Date(),
        token: null,
        roles: {
            teacher: false,
            student: false,
            admin: false
        }
    }

    const registration = async (fullName, birthDate, email, password, confirmPassword) => {
        const response = await fetch(UrlBuilder.account.register(),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({fullName, birthDate, email, password, confirmPassword})
        }).then(response => {
            if (response.ok) {
                return response.json()
            }else{
                console.log({fullName, birthDate, email, password, confirmPassword})
                throw new Error('Registration is failed');
            }
        }).then(result => {
            console.log(result)
            localStorage.setItem('token', result.token);
            user.token = result.token;
            user.email = email;
            user.birthday = birthDate;
            user.fullName = fullName;
            return result
        }).catch(error => {
            return new Error(error)
        })
    }

    const login = async (email, password) => {
        ////alert(`Это запрос в user ${email}`)
        return fetch(UrlBuilder.account.login(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        }).then(response => {
            if (response.ok) {
                //alert('типа ретерним response')
                return response.json()
            }else {
                throw new Error('Login is failed');
            }
        }).then(result => {
            ////alert('Тут токен идет в сторег')
            localStorage.setItem('token', result.token);
        }).catch(error => {return new Error(error)})
    }
    const logout = async () =>{
        const response = await fetch(UrlBuilder.account.logout(), {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + user.token,
            }
        }).then(response => {
            if (response.ok) {
                localStorage.removeItem('token');
                user.token = "";
                user.email = "";
                user.birthday = "";
                user.fullName = "";
                user.roles = {
                    teacher: false,
                    student: false,
                    admin: false
                }
            }else{
                throw new Error('Logout is failed');
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const roles = async () =>{
        const response = await fetch(UrlBuilder.users.roles(), {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token,
            }
        }).then(response => {
            if (response.ok) {
                return response.json()
            }else{
                throw new Error('Unauthorized');
            }
        }).catch(error => {
            console.log(error);
        })

        if (response){
            user.roles.admin = response.isAdmin
            user.roles.student = response.isStudent
            user.roles.teacher = response.isTeacher
        }
    }

    const profile = async () => {
        const response = await fetch(UrlBuilder.account.profile(), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + user.token,
            }
        }).then(response => {
            if (response.ok) {
                return response.json()
            }else{
                user.token = ''
                localStorage.removeItem('token');
                throw new Error('Unauthorized');
            }
        }).then(async (response) =>{
            user.email = response.email;
            user.birthday = new Date(response.birthDate);
            user.fullName = response.fullName;
            await roles()
        }).catch(error => {
            console.log(error);
        });
    }

    const init = async () =>{
        const token = localStorage.getItem('token');
        if (token){
            user.token = token;
            await profile()
        }
    }

    await init();

    return {
        user,
        registration,
        login,
        logout
    }
}

export default userState