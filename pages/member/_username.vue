<template>
    <div>
        <a-layout>
            <a-row :gutter="32">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16 gray">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <a-badge :count="res.total">
                                        <a-avatar
                                            v-if="user.avatar.id" shape="square"
                                            style="width: 100px; height: 100px;">
                                            <img :alt="user.username"
                                                 :src="api_domain + user.avatar.thumbnails.thumb_150_150">
                                        </a-avatar>
                                        <a-avatar v-else shape="square" icon="user"/>
                                    </a-badge>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h3 class="ant-list-item-meta-title">
                                        {{convertName(user)}}
                                    </h3>
                                    <div class="ant-list-item-meta-description"></div>
                                </div>
                            </div>
                        </a-card>
                        <a-card :body-style="{padding: 0}">
                            <a-card :bordered="false" :body-style="{paddingBottom: 0}">
                                <h1 class="uppercase">Facts by {{convertName(user)}}</h1>
                            </a-card>
                            <FactList :data="res" :query="query" :page-size="10"/>
                        </a-card>
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
