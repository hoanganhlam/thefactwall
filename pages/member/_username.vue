<template>
    <div>
        <a-layout>
            <a-row :gutter="32">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16 gray">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <div
                                        style="width: 150px; height: 150px;"
                                        class="ant-avatar ant-avatar-circle ant-avatar-image">
                                        <img v-if="user.avatar.id" :alt="user.username"
                                             :src="api_domain + user.avatar.thumbnails.thumb_150_150">
                                        <img alt="Empty Avatar" v-else src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">                                    </div>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h3 class="ant-list-item-meta-title">
                                        {{convertName(user)}}
                                    </h3>
                                    <div class="ant-list-item-meta-description"></div>
                                </div>
                            </div>
                        </a-card>
                        <h1 class="uppercase">Facts by {{convertName(user)}}</h1>
                        <FactList :data="res" :query="query" :page-size="10"/>
                    </a-layout-content>
                </a-col>
                <a-col class="gutter-row" :md="8" :xs="24">
                    <a-layout-sider width="100%" :style="{ background: '#FFF' }">
                        <a-card title="Following">
                            <p>card content</p>
                            <p>card content</p>
                            <p>card content</p>
                        </a-card>
                    </a-layout-sider>
                </a-col>
            </a-row>
        </a-layout>
    </div>
</template>

<script>
    import FactList from '../../components/fact/List'

    export default {
        name: "PageMember",
        components: {
            FactList
        },
        async asyncData({app, params, query}) {
            let user = await app.$axios.$get(`/auth/users/${params.username}`)
            let res = await app.$axios.$get(`/fact/facts/?user=${user.id}&page_size=10`)
            query.user = user.id
            return {
                user: user,
                res: res,
                query: query,
            }
        },
        head() {
            return {
                title: `Facts by ${this.convertName(this.user)}`
            }
        }
    }
</script>

<style scoped>

</style>
