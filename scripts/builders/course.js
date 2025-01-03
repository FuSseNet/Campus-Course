import UrlBuilder from "../api.js";
import modals from "../modals.js";

const course = {
    details:{}
}

const getDetails = async (id) =>{
    const response = await fetch(UrlBuilder.courses.details(id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + localStorage.getItem('token'),
        },
    }).then(response => {
        if (response.ok) {
            return response.json()
        }else{
            throw new Error('Course details get failed');
        }
    }).then(result => {
        console.log(result)
        course.details = result;
        return course.details;
    }).catch((error) => {return new Error(error)})
}

const courseState ={
    course,
    getDetails
}

export default courseState