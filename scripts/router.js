const router = (() => {
    console.log(location.href.split('/')[4])
    let paths = {
        login: {
            url: "/login/",
            check: (url) => {
                return url.pathname.replaceAll("/", "") === "login"
            }
        },
        registration: {
            url: "/registration/",
            check: (url) => {
                return url.pathname.replaceAll("/", "") === "registration"
            }
        },
        root: {
            url: "/",
            check: (url) => {
                return url.pathname === "/"
            }
        },
        profile: {
            url: "/profile/",
            check: (url) => {
                return url.pathname.replaceAll("/", "") === "profile"
            }
        },
        groups:{
            url: "/groups/",
            check: (url) => {
                return url.pathname.replaceAll("/", "") === "groups"
            }
        },
        group:{
            url: "/groups/",
            check: (url) => {
                const regex = /^\/groups\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
                return regex.test(url.pathname);
            },
            getId: (url) => {
                const regex = /^\/groups\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
                const match = url.pathname.match(regex);
                return match[1];
            }
        }
    }

    const getUrl = () => {
        const nowUrl = new URL(location.href)

        var res = {}
        for (let url in paths) {
            if (paths[url].check(nowUrl)) {
                res = {
                    data: nowUrl,
                    key: url,
                }
                if (url === 'group') {
                    res.id = paths[url].getId(nowUrl)
                    console.log(res)
                }
            }
        }
        return res;
    }

    const gotoUrl = (key, id) => {
        console.log(id)
        var newUrl = new URL(location.href)
        if (id) {
            newUrl.pathname = paths[key].url + id
        }
        else {
            /*if (key === 'postCreate') {
                newUrl.pathname = paths[key].url + 'create'
            }
            else {*/
                newUrl.pathname = paths[key].url
            /*}*/
        }
        location.href = newUrl
    }

    const reload = () =>{
        location.reload()
    }
    return {
        reload: reload,
        get: getUrl,
        goto: gotoUrl,
    }

})();

export default router