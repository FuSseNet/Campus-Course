import courseState from "./course.js";
import presets from "../presets.js";
import UrlBuilder from "../api.js";
import groupState from "../group.js";
import modals from "../modals.js";
const coursePageBuilder = async (user) =>{
    await courseState.getDetails(location.href.split('/')[4]);
    console.log(courseState.course.details)
    const course = courseState.course.details;

    let userIsStudent = await checkUser(location.href.split('/')[4]);

    let {teachers, students} = course;

    let roles = {
        isTeacher: teachers.filter(it => it.email === user.email).length === 1,
        isStudent: userIsStudent,
    }
    if (roles.isTeacher){
        roles.ismainTeacher = teachers.filter(it => it.email === user.email)[0].isMain
    }
    let newUser = {...user};
    newUser.roles = {...roles, ...newUser.roles}

    let cont = $('<div>',{
        class:'d-lg-flex w-100 flex-column d-block course-container p-5'
    })
    let title = $('<span>',{
        class:'display-2',
        html: course.name
    })
    cont.append(title)

    let mainDataCont = $('<div>',{
        class: 'd-flex flex-row justify-content-between'
    })
    let courseDataCont = $('<div>',{
        class:'w-100 d-flex flex-column'
    })
    mainDataCont.append($('<strong>', {html: 'Основные данные курса'}))

    let edit;
    let editStatus;
    let enterBtn;

    if (newUser.roles.admin){
        await groupState.getAllUsers()
        edit = presets.crud.edit([
            presets.components.inputCont(
                {'for': 'courseName-input', html: 'Название курса'},
                {name: "name", type: 'text', id: 'courseName-input', value: course.name, required: true},
                {'class': 'form-floating my-2'},
                null,
                "Название не может быть пустым"),
            presets.components.inputCont(
                {'for': 'courseYear-input', html: 'Год начала'},
                {name: "startYear", type: 'number', min: '2000', max: '2029', value: course.startYear, id: 'courseYear', required: true},
                {'class': 'form-floating my-2'},
                null,
                "Год начала обязателен и не должен превышать 3000"),
            presets.components.inputCont(
                {'for': 'coursePlaces-input', html: 'Количество мест'},
                {name: "maximumStudentsCount", type: 'number', value: course.maximumStudentsCount, min: '0', max: '200', id: 'coursePlaces-input', required: true},
                {'class': 'form-floating my-2'},
                null,
                "Количество мест обязательно"),
            presets.components.radioCont(
                'semester',
                {'class': 'd-flex flex-column'},
                true,
                [
                    {title: 'Осенний', value: 'Autumn', checked: (course.semester === "Autumn")},
                    {title: 'Весенний', value: 'Spring', checked: (course.semester === "Spring")}
                ],
                "Семестр"
            ),
            presets.components.summernote('Требования', {name:'requirements', minLength:1, required:true, html: course.requirements}),
            presets.components.summernote('Аннотации', {name:'annotations', minLength:1, required:true, html: course.annotations}),
            presets.components.optionInput('Основной преподаватель курса', groupState.group.users, {name:'mainTeacherId', required:true, type:'text'}, null, 'Выберите основного преподавателя')
        ],
            async (data) => {
                return fetch(
                    UrlBuilder.courses.editCourse(course.id),
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": 'Bearer ' + localStorage.getItem('token'),
                        },
                        body: JSON.stringify(data)
                    }
                ).then(response => {
                    if (response.ok) {
                        return true;
                    }
                    else{
                        throw new Error(response.status);
                    }
                })
            }
        )
    }else if (newUser.roles.isTeacher){
        edit = presets.crud.edit([
                presets.components.summernote("Требования",{name: 'requirements',minLength:1, required:true, html: course.requirements}),
                presets.components.summernote("Аннотации",{name: 'annotations',minLength:1, required:true, html: course.annotations})
            ],
            async (data) => {
                return fetch(UrlBuilder.courses.teacherEdit(id), {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify(data)
                }).then(response => {
                    if (response.ok){
                        return true;
                    }
                    else{
                        throw new Error(response.status);
                    }
                }).catch(error => {
                    throw new Error(error);
                })
            }
        )
    }

    if (newUser.roles.isTeacher || newUser.roles.admin){
        editStatus = presets.crud.edit([
                presets.components.radioCont(
                        "status",
                    {},
                    true,
                    [
                        {
                            title: 'Открыт для записи',
                            value: 'OpenForAssigning',
                            checked: false
                        },
                        {
                            title: 'В процессе',
                            value: 'Started',
                            checked: false
                        },
                        {
                            title: 'завершен',
                            value: 'Finished',
                            checked: false
                        },
                    ],
                    "Статус")],
            async (data) => {
                return fetch(UrlBuilder.courses.course.status(id),{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        "Authorization": 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify(data)
                }).then(response => {
                    if (response.ok){
                        return true;
                    }
                    else{
                        return response.json().then(res => {
                            throw new Error(res.message)
                        })
                    }
                }).catch(error => {
                    modals.modal(`${error}`, "Ошибка", 'error')
                })
            }
        );
    }
    if (!newUser.roles.isStudent && !newUser.roles.isTeacher && course.status === 'OpenForAssigning'){
        enterBtn = presets.components.Btn({
                html: 'записаться на курс'
            },
            "btn-success",
            async () => {
                return fetch(UrlBuilder.courses.enterCourse(course.id),{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": 'Bearer ' + localStorage.getItem('token'),
                        },
                    }).then(response => {
                    if (response.ok){
                        router.reload();
                        return true
                    }
                    else{
                        return response.json().then(res => {
                            throw new Error(res.message)
                        })
                    }
                }).catch(error => {
                    modals.modal(error, 'Ошибка', 'error');
                })
            }
        )
    }
    mainDataCont.append(edit)

    let courseCont = $('<ul>', {'class' : `list-group`})

    let courseInfo = []
    let statusCont = $('<div>', {
        class: 'd-flex flex-column flex-md-row w-100 justify-content-between'
    })
    let localStatusCont = $('<div>',{
        class:'d-inline-flex flex-column'
    })
    let statusTitle = $('<span>',{
        html:'Статус курса'
    })
    let status;
    switch (course.status) {
        case 'Created':
            status = $('<p>',{
                class:'text-secondary',
                html:`<strong>Создан</strong>`
            })
            break;
        case 'Started':
            status = $('<p>',{
                class:'text-primary',
                html:`<strong>В процессе обучения</strong>`
            })
            break;
        case 'OpenForAssigning':
            status = $('<p>',{
                class:'text-success',
                html:`<strong>Открыт для записи</strong>`
            })
            break;
        case 'Finished':
            status = $('<p>',{
                class:'text-danger',
                html:`<strong>Закрыт</strong>`,
            })
            break;
    }
    localStatusCont.append(statusTitle, status)
    statusCont.append(localStatusCont, (enterBtn)? enterBtn: edit);
    let YearAndSemesterCont = $('<div>', {
        class: 'd-flex flex-column flex-md-row w-100 justify-content-between'
    })
    let localYearCont = $('<div>',{
        class:'d-inline-flex flex-column flex-grow-1'
    })
    let yearTitle = $('<span>',{
        html:'Учебный год'
    })
    localYearCont.append(yearTitle, `${course.startYear}-${course.startYear+1}`)
    let localSemesterCont = $('<div>',{
        class:'d-inline-flex flex-column flex-grow-1'
    })
    let semesterTitle = $('<span>',{
        html:'Семестр'
    })
    localSemesterCont.append(semesterTitle, (course.semester === "Spring" ? "Веснний" : "Осенний"))
    YearAndSemesterCont.append(localYearCont, localSemesterCont)
    let studentsInfoCont = $('<div>', {
        'class': 'd-flex flex-column flex-md-row w-100 justify-content-between'
    })
    let maxStudentsCont = $('<div>',{
        class:'d-inline-flex flex-column flex-grow-1'
    })
    let maxStudentsTitle = $('<span>',{
        html:'Всего мест'
    })
    maxStudentsCont.append(maxStudentsTitle, course.maximumStudentsCount)
    let curretnStudentsCont = $('<div>',{
        class:'d-inline-flex flex-column flex-grow-1'
    })
    let curretnStudentsTitle = $('<span>',{
        html:'Студентов зачислено'
    })
    curretnStudentsCont.append(curretnStudentsTitle, course.students.filter(it => it.status === 'Accepted').length)
    studentsInfoCont.append(maxStudentsCont, curretnStudentsCont)
    let queueStudentsCont = $('<div>', {
        'class': 'd-inline-flex flex-column'
    })
    let  queueStudentsTitle = $('<span>',{
        html:'Заявок на рассмотрении'
    })
    queueStudentsCont.append(queueStudentsTitle, course.students.filter(it => it.status === 'InQueue').length)
    courseInfo.push(statusCont, YearAndSemesterCont, studentsInfoCont, queueStudentsCont)

    let ulList = []
    courseInfo.forEach(el =>{
        let li = $('<li>', {'class' : `list-group-item ${el.hasClass('important') ? 'bg-danger text-light' : ''}`})
        li.append(el)
        ulList.push(li)
    })
    courseCont.append(ulList)
    courseDataCont.append(mainDataCont, courseCont)
    cont.append(courseDataCont)
    $('#app').append(cont)
}


const checkUser = async (id) =>{
    return fetch(UrlBuilder.courses.my(), {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
    }).then(response => {
        if (response.ok){
            return response.json()
        }
        else{
            return response.json().then(res => {
                throw new Error(response.message)
            })
        }
    }).then(result => {
        return result.filter(el => el.id === id).length === 1;
    })
}

export default coursePageBuilder;