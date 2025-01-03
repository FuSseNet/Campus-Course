const init = () =>{
    $('body').append($('<div>', {
        class: '',
        id:'modals-container'
    }))
}

const modal = (content, name="", status = "success", listBtn = [], close = () => {}) => {
    var id = `modal-${$('.modal').length + 1}`

    var bg = $('<div>',{
        class:'z-2 modal-bg',
        id:`${id}-bg`
    })

    var modal = $('<div>',{
        class:'my-modal position-absolute z-3 rounded bg-white border border-1 p-3 d-flex flex-column justify-content-center align-items-center',
        id:`${id}-modal`
    })

    var line = $('<hr>', {
        class:'w-100'
    })

    switch (status){
        case 'success':
            modal.addClass('border-success')
            line.addClass('bg-success')
            break;
        case 'error':
            modal.addClass('border-danger')
            line.addClass('bg-danger')
            break;
        default:
            break;
    }

    const exit = (event) =>{
        $(`#${id}-bg`).remove()
        $(`#${id}-modal`).remove()
        close()
    }

    var title = $('<div>',{
        class:'d-flex justify-content-between w-100'
    })

    var closeBtn = $('<button>',{
        class:'btn-close text-reset',
        id:`${id}-closeBtn`
    })

    closeBtn.on('click', exit)
    bg.on('click', exit)

    title.append([
        $('<strong>',{
            html:name
        }),
        closeBtn
    ])

    modal.append([
        title,
        line.clone(),
        ...content
    ])

    if (listBtn.length > 0) {
        let btnCont = $('<div>',{
            class:'w-100 d-flex flex-row justify-content-end'
        })
        btnCont.append(listBtn)

        modal.append([
            line.clone(),
            btnCont
        ])
    }

    $('#modals-container').append(bg, modal)

    $(`#${id}-closeBtn`).focus()

    return exit;
}

const modals = {
    init,
    modal
}

export default modals