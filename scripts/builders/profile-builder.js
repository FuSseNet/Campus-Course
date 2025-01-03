const profileBuilder = (user) => {
    var cont = $("<div>", {
        class: 'container'
    })
    var frm = $('<form>', {
        id: "profileForm",
        name: "profile",
        action:"",
        method: "post"
    })
    var emailGroup = $('<div>',{
        class:'form-group row mb-3',
        id:'email-group',
    })
    var emailLabel = $('<label>',{
        class:"col-sm-2 col-form-label",
        html:'Email',
        for:'email-input'
    })
    var emailText = $('<input>',{
        type:'text',
        class:"form-control-plaintext",
        id:'email-input',
        readonly:true,
        disabled:true,
        value:user.email
    })
    var emailInput = $('<div class="col-sm-10"></div>').append(emailText)
    emailGroup.append(emailLabel, emailInput)

    var nameDiv = $('<div>', {
        id: 'form-group row'
    })
    var nameLabel = $('<label>', {
        for: "fullName",
        class:"col-sm-2 col-form-label",
        html: "ФИО"
    })
    var nameCont = $('<div>',{
        class:'col-sm-10'
    })
    var Name = $('<input>', {
        class:'form-control',
        type: 'text',
        id: 'fullName',
        name: 'ФИО',
        value:user.fullName
    })
    nameCont.append(Name)
    nameDiv.append(nameLabel, nameCont)

    var dateDiv = $('<div>', {
        id: 'form-group row'
    })
    var dateLabel = $('<label>', {
        for: "birthDate",
        class:"col-sm-2 col-form-label",
        html: "День рождения"
    })
    var dateCont = $('<div>',{
        class:'col-sm-10'
    })
    var bDate = $('<input>', {
        class:'form-control',
        type: 'Date',
        id: 'birthDate',
        name: 'date',
        value:user.birthday.getFullYear() + '-' + ("0" + (user.birthday.getMonth() + 1)).slice(-2) + '-' + ("0" + user.birthday.getDate()).slice(-2)
    })
    dateCont.append(bDate)
    dateDiv.append(dateLabel, dateCont)

    var submit = $('<button>',{
        class:'btn btn-primary',
        type:'submit',
        html:'изменить'
    })
    /*frm.submit(function (event) {
        event.preventDefault();

        var fullName = $('#fullName').val()
        var birthDate = new Date($('#birthDate').val()).toISOString()
        console.log(birthDate)
        ProfilePut(fullName, birthDate)
    })*/
    frm.append(nameDiv, emailGroup, dateDiv, submit)
    cont.append(frm)
    $("#app").append(cont)
    /*$.ajax({
        url: UrlBuilder.account.profile(),
        method: 'get',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        success: (profile) => {
            $('#fullName').val(profile.fullName)
            var d = new Date(profile.birthDate)
            $('#birthDate').val(d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2))
        },
        error: (jqXHR, exception) => {
            console.log(jqXHR.status)
            if (jqXHR.status === 401) {
                localStorage.removeItem('token')
                router.goto('login')
            }
            else {
                console.error(exception)
            }
        }
    })*/
}
export default profileBuilder;