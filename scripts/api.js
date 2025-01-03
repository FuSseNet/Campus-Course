const UrlBuilder = {
    root: 'https://camp-courses.api.kreosoft.space',
    account: {
        register: () => `${UrlBuilder.root}/registration`,
        login: () => `${UrlBuilder.root}/login`,
        logout: () => `${UrlBuilder.root}/logout`,
        profile: () => `${UrlBuilder.root}/profile`,
    },
    users:{
        users: () => `${UrlBuilder.root}/users`,
        roles: () => `${UrlBuilder.root}/roles`,
    },
    groups:{
        listGroups:() => `${UrlBuilder.root}/groups`,
        create:() => `${UrlBuilder.root}/groups`,
        edit:(id) => `${UrlBuilder.root}/groups/${id}`,//groups{id}
        delete:(id) => `${UrlBuilder.root}/groups/${id}`,//groups{id}
        listCourses:(id) => `${UrlBuilder.root}/groups/${id}`,//groups{id}
        createCourse:(id) => `${UrlBuilder.root}/groups/${id}`,
    },
    courses:{
        detail:(id) => `${UrlBuilder.root}/courses/${id}/details`,
    }
}

export default UrlBuilder;