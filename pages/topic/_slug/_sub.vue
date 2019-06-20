<template>
    <div>
        <a-layout>
            <a-row :gutter="16">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16 gray">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar" v-if="topic.media">
                                    <div style="width: 150px; height: 150px;"
                                         class="ant-avatar ant-avatar-circle ant-avatar-image">
                                        <img :src="api_domain + topic.media.thumbnails.thumb_150_150">
                                    </div>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h3 class="ant-list-item-meta-title">{{topic.name}}</h3>
                                    <div class="ant-list-item-meta-description">
                                        <p>{{topic.description}}</p>
                                    </div>
                                </div>
                            </div>
                        </a-card>
                        <h1 class="uppercase">{{capitalizeFirst(this.title)}}</h1>
                        <FactList :data="topic.fact" :query="query" :page-size="10"/>
                    </a-layout-content>
                </a-col>
                <a-col class="gutter-row" :md="8" :xs="24">
                    <a-layout-sider width="100%">
                        <a-card title="Contributors" class="bt_16">
                            <user-card
                                class="bt_16"
                                v-for="contributor in topic.contributors"
                                :key="contributor.id"
                                :user="contributor"/>
                        </a-card>
                    </a-layout-sider>
                </a-col>
            </a-row>
        </a-layout>
    </div>
</template>

<script>
    import FactList from '../../../components/fact/List'
    export default {
        head() {
            return {
                title: this.capitalizeFirst(this.title)
            }
        },
        async asyncData({app, params, query}) {
            let res = await app.$axios.$get(`/fact/topics/${params.slug}/`)
            if (typeof params.sub === 'undefined') {
                params.sub = 'facts'
            } else {
                params.sub = params.sub + ' facts'
            }
            query.topic = res.id
            return {
                topic: res,
                title: params.sub + ' about ' + res.name,
                query: query
            }
        },
        data() {
            return {}
        },
        components: {
            FactList
        }
    }
</script>

<style>
</style>
