const registerBuilder = (registration = () => {}, succeed = () => {}, err = (er) => console.log(er)) =>{
    var bg = $('<div>',{
        class:"background-image"
    })
    var cont = $('<div>',{
        class:'container bg-white border shadow rounded d-block p-5 login-container'
    })
    var title = $('<h2>',{
        class:'title mb-3',
        html:'Регистрация'
    })
    var frm = $('<form>',{
        class:'needs-validation',
        noValidate:true
    })

    var nameGroup=  $('<div>',{
        class:'form-group mb-3',
        id:'name-group'
    })
    var nameLabel = $('<label>',{
        class:'label',
        html:'ФИО',
        for:'name-input'
    })
    var nameInput = $('<input>',{
        class:'form-control',
        id:'name-input',
        type:'text',
        required:true
    })
    var validName = $('<div>',{
        class:'valid-feedback',
    })
    var invalidName = $('<div>',{
        class:'invalid-feedback',
        html:'Введите имя'
    })
    nameGroup.append(nameLabel, nameInput, validName, invalidName)

    var dateGroup = $('<div>',{
        class:'form-group mb-3',
        id:'date-group',
    })
    var dateLabel = $('<label>',{
        class:'label',
        html:'День рождения',
        for: 'date-input'
    })
    var dateInput = $('<input>',{
        class:'form-control',
        id:'date-input',
        type:'date',
        placeholder:'дд.мм.гггг',
        required:true
    })
    var validDate = $('<div>',{
        class:'valid-feedback',
    })
    var invalidDate = $('<div>',{
        class:'invalid-feedback',
        html:'Введите дату'
    })
    dateGroup.append(dateLabel, dateInput, validDate, invalidDate)

    var emailGroup = $('<div>',{
        class:'form-group mb-3',
        id:'email-group',
    })
    var emailLabel = $('<label>',{
        class:'label',
        html:'Email',
        for:'email-input'
    })
    var emailInput = $('<input class="form-control" id="email-input" type="email" aria-describedby="email-help" required>')
    var emailHelp = $('<small>',{
        class:'form-text text-muted',
        id:'email-help',
        html:'Email будет использоваться для входа в систему'
    })
    var validEmailFeedback = $('<div>',{
        class:'valid-feedback',
    })
    var invalidEmailFeedBack = $('<div>',{
        class:'invalid-feedback',
        html:'Введите почту'
    })
    emailGroup.append(emailLabel, emailInput,validEmailFeedback, invalidEmailFeedBack, emailHelp)

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
        required:true,
        minLength:8
    })
    var validPass = $('<div>',{
        class:'valid-feedback'
    })
    var invalidPass =$('<div>',{
        class:'invalid-feedback',
        html:'Введите пароль!'
    })
    passGroud.append(passLabel, passInput, validPass, invalidPass)

    var passRepeatGroup  = $('<div>',{
        class:'form-group mb-3',
        id:'pass-repeat-group',
    })
    var passRepeatLabel = $('<label>',{
        class:'label',
        html:'Повторите пароль',
        for:'pass-repeat-input',
    })
    var passRepeatInput = $('<input>',{
        class:'form-control',
        id:'pass-repeat-input',
        type:'password',
        required:true,
        minLength:8
    })
    var validRepeatPass = $('<div>',{
        class:'valid-feedback'
    })
    var invalidRepeatPass =$('<div>',{
        class:'invalid-feedback',
        html:'Пароли должны совпадать!',
        id:'invalid-repeat'
    })
    var submit = $('<button>',{
        class:'btn btn-primary my-2 w-100',
        type:'submit',
        html:'Зарегестрироваться'
    })
    passRepeatGroup.append(passRepeatLabel, passRepeatInput, validRepeatPass, invalidRepeatPass)
    frm.append(title, nameGroup, dateGroup, emailGroup, passGroud, passRepeatGroup, submit)
    frm.on('submit', (event) => {
        event.preventDefault()
        submit.attr('disabled',true);
        submit.empty()
        submit.append($('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'), 'Загрузка...')
        if ($('#pass-input').val() !== $('#pass-repeat-input').val()){
            event.preventDefault()
            $('#pass-repeat-input').get(0).setCustomValidity('Пароли должны совпадать');
            event.target.classList.add('was-validated')
            submit.attr('disabled',false);
            submit.text('Зарегистрироваться')
        }else{
            $('#pass-repeat-input').get(0).setCustomValidity('')
            if (!event.target.checkValidity()) {
                submit.attr('disabled',false);
                submit.text('Зарегистрироваться')
                event.preventDefault();
                event.stopPropagation();
            }else{
                submit.attr('disabled',true);
                submit.empty()
                submit.append($('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'), 'Загрузка...')
                registration($('#name-input').val(), $('#date-input').val(), $('#email-input').val(), $('#pass-input').val(), $('#pass-repeat-input').val()).then((res) => {
                    if (localStorage.getItem('token'))
                    {
                        submit.attr('disabled',false);
                        submit.text('Зарегистрироваться')
                        succeed();
                    }
                    submit.attr('disabled',false);
                    submit.text('Зарегистрироваться')
                }).catch((error) => {
                    submit.attr('disabled',false);
                    submit.text('Зарегистрироваться')
                    err(error)
                    if (error.status === 409) {
                        alert('Пользователь с такими данными(ФИО или Почта) уже зарегестрирован в системе!')
                    }
                })
            }
        }
        event.target.classList.add('was-validated')
    })
    cont.append(frm)
    $('#app').append(bg, cont)
}
export default registerBuilder;