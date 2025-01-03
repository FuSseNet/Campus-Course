const coursePageBuilder = async (course) =>{
    let title = $('<strong>',{
        class:'title mb-3',
        html: course.title
    })

    let mainDataTitle = $('<p>',{
        class:'mb-3',
        html:'Основные данные курса'
    })

    let mainDataCont = $('<div>',{
        class:'container',
    })
    let head = $('<div>',{
        class:'d-flex justify-content-between',
    })
    let changeBtn;
    let statusCont = $('<div>')
    statusCont.append($('<strong>'),{
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
    statusCont.append(status)
    head.append(statusCont, changeBtn)
    crs.append(head)
    crs.append($('<p>',{class:'mb-0', html:`Учебный год - ${course.startYear}-${parseInt(course.startYear) + 1}`}))
    crs.append($('<p>',{class:'mb-0', html:`Семестр - ${(course.semester === 'Autumn')? 'Осенний':'Весенний'}`}))
    crs.append($('<p>',{class:'mb-0 text-muted', html:`Мест всего - ${course.maximumStudentsCount}`}))
    crs.append($('<p>',{class:'mb-0 text-muted', html:`Мест свободно - ${course.remainingSlotsCount}`}))
}