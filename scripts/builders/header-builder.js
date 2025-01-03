import router from "../router.js"
const headerBuilder = async (userData) => {
    const {user, login, logout} = userData;

    var {isAdmin, isStudent, isTeacher} = user.roles;
    var courseGrops = $('<li class="nav-item"><a class="nav-link" href="/groups" >Группы курсов</a></li>')
    var myCourses = $('<li class="nav-item"><a class="nav-link" href="#" >Мои курсы</a></li>')
    var teachCourses = $('<li class="nav-item"><a class="nav-link" href="#">Преподаваемые курсы</a></li>>')

    var registerItem = $('<li class="nav-item"><a class="nav-link" id="registerBtn" href="/registration">Регистрация</a></li>')

    var enterItem = $('<li class="nav-item"><a class="nav-link"  id="enterBtn" href="/login" >Вход</a></li>')
    var exitBtn = $('<a>',{
        class:"nav-link",
        id: 'exitBtn',
        html:'Выход',
        href:'#'
    })
    exitBtn.on('click', (event) => {
        event.preventDefault()
        logout().then((res)=>{
            router.goto('root')
        })
    })
    var exitItem = $('<li class="nav-item"></li>').append(exitBtn)
    var profileBtn = $('<a>',{
        class:'nav-link',
        id:'profileBtn',
        href:'profile',
        html:user.email
    })
    var profileItem = $('<li class="nav-item"></li>').append(profileBtn)

    var themeBtn = $('<button>',{
        html:'Dark',
        class:"btn btn-primary themeBtn"
    })
    themeBtn.on('click', (e) => {
        if($('html').attr('data-bs-theme') === 'dark'){
            themeBtn.text('Dark')
            $('html').attr('data-bs-theme', 'light')
            localStorage.setItem('theme', 'light')
        }
        else{
            themeBtn.text('Light')
            $('html').attr('data-bs-theme', 'dark')
            localStorage.setItem('theme', 'dark')
        }
    })
    $('#second-nav-list').append(themeBtn)
    if (user.token){
        if (isTeacher){
            if (isStudent){
                $('#first-nav-list').append(courseGrops, myCourses, teachCourses)
                $('#second-nav-list').append(profileItem, exitItem)
            }else{
                $('#first-nav-list').append(courseGrops, teachCourses)
                $('#second-nav-list').append(profileItem, exitItem)
            }
        }else{
            if (isStudent){
                $('#first-nav-list').append(courseGrops, myCourses)
                $('#second-nav-list').append(profileItem, exitItem)
            }
            else{
                $('#first-nav-list').append(courseGrops)
                $('#second-nav-list').append(profileItem, exitItem)
            }
        }
    }else{
        $('#second-nav-list').append(registerItem, enterItem)
    }
}

export default headerBuilder