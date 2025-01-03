import modals from "./modals.js";
import router from "./router.js";
import UrlBuilder from "./api.js";

const formReader = (form) =>{
    const {elements} = form

    const data = {}

    Array.from(elements).filter((item) => !!item.value).map(item => {
        const {name, value} = item
        if (item.type === 'checkbox') data[name] = item.checked
        else if (value !== "--") data[name] = value
    })

    return data
}

const label = (attr) =>{
    return $('<label>',{
        ...attr,
        class:'form-label'
    })
}

const input = (listAtr) =>{
    return $('<input>',{
        ...listAtr,
        class: 'form-control',
    })
}

const inputCont = (labelAttr, inputAttr, possibleOpt = {'class': 'mb-3'}, validFeedback = null, invalidFeedback = null) =>{
    let cont = $('<div>',{
        possibleOpt
    })
    let valid = (validFeedback) ? $('<div>',{class:'valid-feedback', html:validFeedback}) : null
    let invalid = (invalidFeedback)? $('<div>', {class:'invalid-feedback', html:invalidFeedback}) : null
    cont.append(label(labelAttr), input(inputAttr), valid, invalid)
    return cont
}

const Btn = (attr, classes, func) =>{
    let btn = $('<button>',{
        ...attr,
        class:'btn' + classes
    })
    btn.on('click', function(){func()})
    return btn
}

const submitBtn = (name = 'Подтвердить', classes = '', possibleOpt = {}) =>{
    let submitBtn = $('<button>',{
        class:'btn btn-primary' + (classes !== "" ? `${classes}`: ''),
        html:name,
        id:'submitBtn',
        type:'submit',
        ...possibleOpt
    })

    function start(){
        $('#submitBtn').addClass('disabled')
        $('#submitBtn').empty()
        $('#submitBtn').append($('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'), 'Загрузка...')
    }

    function finish(){
        $('#submitBtm').attr('disabled',false)
        $('#submitBtn').text(name)
    }

    return {
        submitBtn,
        start,
        finish
    }
}

const add = (title = 'Создать', func, inputList = []) =>{
    let btn = $('<button>',{
        html:title,
        class: 'btn btn-primary m-2 align-self-center'
    })

    let frm = $('<form>',{
        class:'w-100 needs-validation',
        id:'group-edit-form',
        noValidate:true
    })

    frm.append(inputList)

    let submit = submitBtn('Создать')

    submit.submitBtn.on('click', function(){
        $('#group-edit-form').submit()
    })

    let modalClose;

    frm.on('submit', (event) =>{
      event.preventDefault()
      if(event.target.checkValidity()){
          submit.start()
          func(formReader(event.target)).then(res =>{
              submit.finish()
              modalClose()
              modals.modal(
                  'Действие выполнено успешно!',
                  'Добавлено!',
                  'success',
                  [],
                  () =>{
                      router.reload();
                  })
          })
      }
      else{
          e.target.classList.add('was-validated')
      }
    })
    btn.on('click', () =>{
        modalClose = modals.modal(
            frm,
            'Создание группы',
            'default',
            [submit.submitBtn],
            () =>{
                $('#group-edit-form').submit()
            }
        )
    })
    return btn
}

const edit = (inputList = [], func) =>{
    let btn = $('<button>',{
        html:'Редактировать',
        class: 'btn btn-primary m-2 align-self-center'
    })

    let frm = $('<form>',{
        class:'w-100 needs-validation',
        id:'group-edit-form',
        noValidate:true
    })
    frm.append(inputList)

    let submit = submitBtn('Сохранить')
    submit.submitBtn.on('click', function(){
        $('#group-edit-form').submit()
    })

    let modalClose;

    frm.on('submit', (event) =>{
        event.preventDefault()
        if(event.target.checkValidity()){
            submit.start()
            func(formReader(event.target)).then(res =>{
                submit.finish()
                modalClose()
                modals.modal(
                    'Действие выполнено успешно!',
                    'Изменено!',
                    'success',
                    [],
                    () =>{
                        router.reload();
                    })
            })
        }
        else{
            event.target.classList.add('was-validated')
        }
    })

    btn.on('click', () =>{
        modalClose = modals.modal(
            frm,
            'Редактирование группы',
            'default',
            [submit.submitBtn],
            () =>{
                $('#group-edit-form').submit()
            })
    })
    return btn
}

const deleteBtn = (func, successFunc, errorFunc) =>{
    let btn = $('<button>',{
        class:'btn btn-outline-danger m-2',
        html:'Удалить'
    })

    btn.on('click', () =>{
        func().then(res =>{
            successFunc()
            router.reload()
        }).catch(error =>{
            errorFunc(error)
        })
    })

    return btn
}

const radio = (name, value, id, classes = null, title) =>{
    let cont = $('<div>',{
        class:'form-check' + ((classes)? `${classes}`:'')
    })
    let check = $("<input>",{
        class:'form-check-input',
        type: 'radio',
        name:name,
        id:`${name}-input-${id}`,
        value:value
    })
    let label = $('<label>',{
        class:'form-check-label',
        for: `${name}-input-${id}`,
        html:title
    })
    cont.append(check, label)
    return cont
}

const radioCont = (name, attributes = {}, inline = false, options = [], title = "") =>{
    let cont = $('<div>',{
        ...attributes
    })
    let group = $('<div>',{
        class:''
    })
    let radioList = []
    options.forEach((element, id) =>{
        radioList.push(radio(name, element.value, id,element.subclasses +  ((inline)? ` form-check-inline`:''),element.title ))
    })
    group.append(radioList)
    cont.append($('<strong>',{class:"title", html:title}), group)
    return cont
}

const summernote = (title, options) =>{
    let cont = $('<div>')
    let label = $('<label>',{
        class:'form-label mb-2',
        for:`${title}-summernote`,
        html:title
    })
    let summernote = $('textarea',{
        class:'sumernote',
        id:`${title}-sumernote`,
        ...options
    })
    cont.append(label, summernote)

    return cont
}

const optionInput = (title, options, attr) =>{
    let cont = $('<div>',{
        ...attr
    })
    let label = $('<label>',{
        class:'form-label mb-2',
        for:`${title}-opt`,
        html:title
    })
    let select = $('<select>',{
        class:'form-control',
        id:`${title}-opt`,
    })
    options.forEach((name, id) =>{
        let opt = $('<option>',{
            value:id,
            label:name,
            class:'option'
        })
        select.append(opt)
    })
    cont.append(label, select)
    return cont
}

const initNote = () =>{
    $('.sumernote').summernote()
}

const presets = {
    crud:{
        add,
        deleteBtn,
        edit,
    },
    components:{
        inputCont,
        submitBtn,
        Btn,
        radioCont,
        summernote,
        initNote,
        optionInput
    }
}
export default presets