import groupState from "../group.js";
import modals from "../modals.js";
import presets from "../presets.js";
import router from "../router.js";
const groupPageBuilder = async(user) =>{
    await groupState.getName(location.href.split('/')[4])
    let groupName = groupState.group.name
    let cont = $('<div>',{
        class:'container'
    })

    let title = $('<h2>',{
        class:'title mb-3',
        html:`Группа - ${groupName}`,
    })
    cont.append(title)
    if (user.roles.admin){
        await groupState.getAllUsers()
        let createCourseBtn = presets.crud.add('Создать курс', (data) => groupState.createCourse(location.href.split('/')[4], data),
            [
                presets.components.inputCont({html:'Название курса'}, {name:'name', minlength:1, type:'text', required:true},null, null, 'Курс с таким именем уже существует'),
                presets.components.inputCont({html:'Год начала курса'}, {name:'startYear', min:2000, max:2029, required:true, type:'number'}, null, null, null),
                presets.components.inputCont({html:'Общее количество мест'}, {name:'maximumStudentsCount', min:1, max:200, required:true, type:'number'}, null, null, null),
                presets.components.radioCont('semester', {}, true, [{title:'Осень', value:'Autumn', subclasses:''}, {title:'Весна', value:'Spring', subclasses:''}], "Семестр"),
                presets.components.summernote('Требования', {name:'requirements', minLength:1, required:true}),
                presets.components.summernote('Аннотации', {name:'annotations', minLength:1, required:true}),
                presets.components.optionInput('Основной преподаватель курса', groupState.group.users, {name:'mainTeacherId', required:true})
            ]
        );

        cont.append(createCourseBtn)
    }
    await groupState.courses(location.href.split('/')[4])

    let courses = groupState.group.coursesList
    let allCourses = $('<div>',{
        class:'container mb-4',
    })
    console.log(courses)
    courses.forEach(course=>{

        let crs = $('<div>',{
            class:'container border shadow rounder'
        })
        let head = $('<div>',{
            class:'d-flex justify-content-between',
        })
        let nameLink = $('<a>',{
            class:'link-light link-underline-opacity-0',
            href:'#',
            html:course.name
        })
        nameLink.on('click',() =>{
            router.goto('courses', course.id)
        })
        let name = $("<strong>",{
            html:nameLink
        })
        head.append($('<p>',{html:name, class:'mb-0'}))
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
        head.append(status)
        crs.append(head)
        crs.append($('<p>',{class:'mb-0', html:`Учебный год - ${course.startYear}-${parseInt(course.startYear) + 1}`}))
        crs.append($('<p>',{class:'mb-0', html:`Семестр - ${(course.semester === 'Autumn')? 'Осенний':'Весенний'}`}))
        crs.append($('<p>',{class:'mb-0 text-muted', html:`Мест всего - ${course.maximumStudentsCount}`}))
        crs.append($('<p>',{class:'mb-0 text-muted', html:`Мест свободно - ${course.remainingSlotsCount}`}))
        allCourses.append(crs)
    })
    cont.append(allCourses)

    $('#app').append(cont)
}

export default groupPageBuilder;