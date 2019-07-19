<template>
    <a-layout>
        <div class="container">
            <a-row :gutter="16">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <Uploader style="max-width: 100px" size="100_100" v-if="updating"
                                              :allow-update="false"
                                              @uploaded="form.avatar = $event ? $event._id: null"/>
                                    <a-badge :count="res.total" v-else>
                                        <img v-if="user.avatar && user.avatar._id" :alt="user.username"
                                             :src="'/' + user.avatar.size['100_100']">
                                        <a-avatar class="xxl" size="large" v-else shape="square" icon="user"/>
                                    </a-badge>
                                </div>
                                <div v-if="updating">
                                    <a-form-item class="bt_16">
                                        <a-row :gutter="16">
                                            <a-col :md="12">
                                                <a-input v-model="form.firstName" placeholder="First name"/>
                                            </a-col>
                                            <a-col :md="12">
                                                <a-input v-model="form.lastName" placeholder="Last name"/>
                                            </a-col>
                                        </a-row>
                                        <a-input v-model="form.bio" placeholder="Bio"/>
                                    </a-form-item>
                                </div>
                                <div v-else class="ant-list-item-meta-content">
                                    <h3 class="ant-list-item-meta-title">{{convertName(user)}}</h3>
                                    <div class="ant-list-item-meta-description">{{user.bio}}</div>
                                </div>
                            </div>
                            <div class="control" @click="handleUpdate">
                                <a-icon v-if="updating" type="save"></a-icon>
                                <a-icon v-else type="edit"></a-icon>
                            </div>
                        </a-card>
                        <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                            <h1 style="font-size: 16px">Facts by {{convertName(user)}}</h1>
                            <FactList :data="res" :query="query"/>
                        </a-card>
                    </a-layout-content>
                </a-col>
                <a-col class="gutter-row" :md="8" :xs="24">
                    <a-layout-sider width="100%">

                    </a-layout-sider>
                </a-col>
            </a-row>
        </div>
    </a-layout>
</template>

<script>
    import FactList from '../../components/fact/List'
    import Uploader from '../../components/media/Uploader'

    export default {
        name: "PageMember",
        components: {
            FactList, Uploader
        },
        async asyncData({app, params, query}) {
            let user = await app.$axios.$get(`/users/${params.username}`)
            if (params.username === 'me') {
                params.username = app.$auth.user.username
            }
            let res = await app.$axios.$get(`/facts/?user=${params.username}&page_size=10`)
            query.user = params.username
            return {
                user: user,
                res: res,
                query: query,
            }
        },
        data() {
            return {
                updating: false,
                form: {
                    firstName: null,
                    lastName: null,
                    avatar: null,
                    bio: null
                }
            }
        },
        head() {
            return {
                title: `Facts by ${this.convertName(this.user)}`
            }
        },
        methods: {
            async handleUpdate() {
                if (!this.updating) {
                    this.updating = true
                } else {
                    let data = this.form
                    if (data.avatar === null) {
                        delete data.avatar
                    }
                    this.user = await this.$api.user.update(this.user.username, data)
                    this.updating = false
                }
            }
        },
        mounted() {
            this.form.firstName = this.user.firstName
            this.form.lastName = this.user.lastName
            this.form.avatar = this.user.avatar._id
        }
    }
</script>

<style lang="scss">
</style>
