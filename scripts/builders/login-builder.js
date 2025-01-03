const loginBuilder = (login = () => {}, succeed = () => {}, err = (er) => console.log(er)) => {
    var bg = $('<div>',{
        class:"background-image"
    })
    var cont = $('<div>',{
        class:'container bg-white border shadow rounded d-block p-5 login-container',
    })
    var title = $('<h2>',{
        class:'title mb-3',
        html:'Авторизация'
    })
    var frm = $('<form>,',{
        class:'needs-validation',
        noValidate:true
    })

    var emailGroup = $('<div>',{
        class:'form-group mb-3',
        id:'email-group',
    })
    var emailLabel = $('<label>',{
        class:'label',
        html:'Email',
        for:'email-input'
    })
    var emailInput = $('<input class="form-control" id="email-input" type="email" minlength="8" required>')

    var validEmailFeedback = $('<div>',{
        class:'valid-feedback',
    })
    var invalidEmailFeedBack = $('<div>',{
        class:'invalid-feedback',
        html:'Введите почту'
    })
    emailGroup.append(emailLabel, emailInput, validEmailFeedback, invalidEmailFeedBack)

    var passGroud = $('<div>',{
        class:'form-group mb-3',
        id:'pass-group',
    })
    var passLabel = $('<label>',{
        class:'label',
        html:'Пароль',
        for:'pass-input'
    })
    var passInput = $('<input>',{
        class:'form-control',
        id:'pass-input',
        type:'password',
        minlength:8,
        required:true
    })
    var invalidPassFeedback = $('<div>',{
        class:'invalid-feedback',
        html:'Пароль должен иметь длину не менее 8 символов'
    })
    var validPassFeedBack = $('<div>',{
        class:'valid-feedback',
    })
    passGroud.append(passLabel, passInput, validPassFeedBack, invalidPassFeedback)

    var submit = $('<button>',{
        class:'btn btn-primary my-2 w-100',
        type:'submit',
        html:'Войти'
    })
    frm.append(title, emailGroup, passGroud, submit)

    frm.on('submit', (event) => {
        event.preventDefault()
        if (!event.target.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }else{
            submit.attr('disabled',true);
            submit.empty()
            submit.append($('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'), 'Загрузка...')
            login($('#email-input').val(), $('#pass-input').val()).then((res) => {
                if (localStorage.getItem('token')){
                    submit.attr('disabled',false)
                    submit.text('Войти')
                    succeed()
                }
                submit.attr('disabled',false)
                submit.text('Войти')
            }).catch((error) => {
                err(error)
            })
        }
        event.target.classList.add('was-validated')
    })
    cont.append(frm)
    $('#app').append(bg, cont)
}
export default loginBuilder;