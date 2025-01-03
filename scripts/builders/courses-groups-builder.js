import modals from "../modals.js";
import groupState from "../group.js";
import presets from "../presets.js";
import router from "../router.js";
const groupsBuilder = async (user) => {
    let cont = $("<div>", {
        class: 'container'
    })
    let title = $('<h2>',{
        class:'title mb-3',
        html:'Группы кампусных курсов'
    })
    let createBtn = presets.crud.add('Создать', groupState.create,
        [presets.components.inputCont({html:'Название группы'}, {name:'name'},null, null, 'Группа с таким именем уже существует')]
        );
    cont.append(title)
    if (user.roles.admin){
        cont.append(createBtn)
    }
    await groupState.getList()
    let groupList;
    groupList = groupState.group.groupList
    groupList.forEach(group => {
        let el = $('<div>',{
            class:'container d-flex justify-content-between border rounded d-block p-3 '
        })
        let name = $('<a>',{
            html:group.name,
            href:'#',
        })
        //'/groups/' + group.id
        name.on('click', () =>{
            router.goto('groups', group.id)
        })
        el.append(name)
        if (user.roles.admin){
            let btnCont = $('<div>')
            let editBtn = presets.crud.edit([
                presets.components.inputCont(
                    {'for':`edit-group-${group.id}`,'html':`Название группы`},
                        {'type':'text', 'class':'form-control', 'id':`edit-group-${group.id}`,'required': true, 'name':'name'}
                    ,{'class': 'mb-3'},'Регистрация прошла успешно!','Такая группа уже зарегестрирована'
            )], async (data) => {return await groupState.edit(data, group.id)})
            btnCont.append(editBtn)
            let deleteBtn = presets.crud.deleteBtn(() => groupState.deleteFunc(group.id), () => modals.modal('Группа удалена успешно', 'Группа удалена','success') ,() =>{throw Error()})
            btnCont.append(deleteBtn)
            el.append(btnCont)
        }
        cont.append(el)
    })
    $("#app").append(cont)
}
export default groupsBuilder;