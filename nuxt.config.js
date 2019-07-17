require('dotenv').config()
module.exports = {
    mode: 'universal',
    env: {
        domain: process.env.DOMAIN,
        apiDomain: process.env.API_DOMAIN,
    },
    /*
    ** Headers of the page
    */
    head: {
        title: process.env.npm_package_name || '',
        titleTemplate: '%s - TheFactWall.com | Explore interesting facts around us!',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},
    /*
    ** Global CSS
    */
    css: [
        'ant-design-vue/dist/antd.less',
        '@/style/app.scss',
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/antd-ui',
        '@/plugins/components',
        '@/plugins/mixins',
        '@/plugins/repository',
        {src: '@/plugins/axios.js', ssr: true},

    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        'cookie-universal-nuxt',
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        baseURL: process.env.API_DOMAIN + '/api/'
    },
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/users/login/',
                        method: 'post',
                        propertyName: 'token',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    },
                    logout: {
                        method: 'post',
                        url: '/users/logout/'
                    },
                    user: {
                        url: '/users/me/',
                        method: 'get',
                        propertyName: ''
                    }
                },
                tokenRequired: true,
                tokenType: 'Bearer'
            },
            google: {
                client_id:
                    '1031942923634-j4m66uaj8toiphphkj2q8q0thkh9horu.apps.googleusercontent.com',
                redirect_uri: process.env.DOMAIN + '/member/callback'
            }
        },
        redirect: {
            login: '/login',
            logout: '/logout',
            callback: '/auth/callback',
            user: '/users/me'
        },
    },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        // extractCSS: true,
        extend(config, ctx) {
            const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

            svgRule.test = /\.(png|jpe?g|gif|webp)$/;

            config.module.rules.push({
                test: /\.svg$/,
                loader: 'vue-svg-loader',
            });
        },
        loaders: {
            less: {
                modifyVars: {
                    'primary-color': '#24890d',
                    'link-color': '#24890d',
                    'border-radius-base': '2px',
                    'menu-dark-submenu-bg': '#000',
                    'menu-dark-bg': '#000',
                    'layout-sider-background': '#FFF',
                    'menu-dark-color': '#FFF',
                    'list-item-meta-margin-bottom': '5px'
                },
                javascriptEnabled: true
            }
        }
    }
}
