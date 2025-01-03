import userState from "../scripts/user.js"
import router from "../scripts/router.js"
import headerBuilder from "../scripts/builders/header-builder.js"
import registerBuilder from "../scripts/builders/register-builder.js";
import loginBuilder from "../scripts/builders/login-builder.js";
import profileBuilder from "../scripts/builders/profile-builder.js"
import groupsBuilder from "../scripts/builders/courses-groups-builder.js"
import groupPageBuilder from "../scripts/builders/group-page-builder.js";
import modals from "../scripts/modals.js";
import coursePageBuilder from "../scripts/builders/course-page-builder.js";

$('html').attr('data-bs-theme', localStorage.getItem('theme'));
$().ready(() => {
    modals.init()
    userState().then(async (userData) => {

        window.onerror = (msg, url, line, col, error) => {
            switch (error.message) {
                case '401':
                    let exitBtn = $('<button>', {
                        class: 'btn btn-danger',
                        html: 'Закрыть',
                        id:'close-btn'
                    })
                    exitBtn.on('click', function(){
                        router.goto('root')
                    })

                    modals.modal('Время вашей сессии истекло, если вы намерены продолжить пользоваться сайтом, совершите вход)))', 'Приносим свои соболезнования', 'error', [exitBtn])
                    break;
                default:
                    modals.modal([`${error.message}`, $('<br>'), `in ${url}: ${line}: ${col}`], "Ошибка", "error")
            }
        }
        const path = router.get();
        const {user,registration, login, logout, profileEdit} = userData
        await headerBuilder(user, logout)
        switch (path.key){
            case 'login':
                loginBuilder(login, () => router.goto('root'))
                break;
            case 'registration':
                registerBuilder(registration, ()=>router.goto('root'))
                break;
            case 'profile':
                profileBuilder(user, profileEdit)
                break;
            case 'groups':
                await groupsBuilder(user)
                break;
            case 'group':
                await groupPageBuilder(user)
                break;
            case 'courses':
                await coursePageBuilder(user)
                break;
        }
    })
})