export default function ({ $axios, app, redirect }) {
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if ([401, 403].includes(code)) {
            app.$auth.logout()
            redirect('/')
        }
        if (code === 404) {
            redirect('/error/404')
        }

        if (code === 500) {
            redirect('/error/500')
        }
    })
}
