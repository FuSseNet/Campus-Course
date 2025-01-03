import UrlBuilder from "./api.js";
import modals from "./modals.js";
import user from "./user.js";
const group = {
    groupList:[],
    coursesList:[],
    name:null,
    users:[]
}
const getList = async() =>{
    const response = await fetch(UrlBuilder.groups.listGroups(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + localStorage.getItem('token'),
        },
    }).then(response => {
        if (response.ok) {
            return response.json()
        }else{
            throw new Error('Groups get failed');
        }
    }).then(result => {
        result.forEach(item => {
            group.groupList.push(item)
        })
        return group.groupList;
    }).catch((error) => {return new Error(error)})
}
const create = async(data) => {
    const response = await fetch(UrlBuilder.groups.create(), {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            return response.json()
        }else{
            throw new Error('Groups create failed');
        }
    }).catch(error => {return new Error(error)})
}
const edit = async(name, id) =>{
    const response = await fetch(UrlBuilder.groups.edit(id), {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(name)
    }).then(response => {
        if (response.ok) {
            return response.json()
        }else{
            throw new Error('Groups create failed');
        }
    }).catch(error => {return new Error(error)})
}

const deleteFunc = async(id) =>{
    const response = await fetch(UrlBuilder.groups.delete(id), {
        method: 'DELETE',
        headers:{
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({id})
    }).then(response => {
        if (response.ok) {
            modals.modal('Группа успешно удалена!','Удаление группы', 'success')
        }else{
            throw new Error('Ошибка удаления группы')
        }
    }).catch(error => {return new Error(error)})
}

const courses = async(id) =>{
    const response = await fetch(UrlBuilder.groups.listCourses(id),{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        }else{
            alert('Ошибка')
            throw new Error('Не удалось получить курсы данной группы');
        }
    }).then(result =>{
        console.log(result)
        result.forEach(item => {
            group.coursesList.push(item)
        })
        return group.coursesList;
    }).catch(error => {return new Error(error)})
}

const getName = async(id) =>{
    await getList()
    group.name = group.groupList.filter(item => item.id === id)[0].name
}

const createCourse = async (groupId, data) =>{
    const response = await fetch(UrlBuilder.groups.createCourse(groupId), {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    }).then(response => {
        modals.modal('Курс был успешно создан!', 'Создание курса', 'success')
    }).catch(error => {return new Error(error)})
}

const getAllUsers = async() =>{
    const response = await fetch(UrlBuilder.users.users(), {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then(response => {
        if (response.ok) {
            modals.modal('Пользователи получены!', 'Получение всех пользователей', 'success')
            return response.json()
        }else{
            throw new Error('Ошибка получения пользователей')
        }
    }).then(result =>{
        result.forEach(item => {
            group.users.push(item)
        })
        return group.users
    })
}
const groupState =  {
    group,
    create,
    edit,
    getList,
    deleteFunc,
    courses,
    getName,
    createCourse,
    getAllUsers
}
export default groupState;