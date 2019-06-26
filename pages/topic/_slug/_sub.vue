<template>
    <div>
        <a-layout>
            <a-row :gutter="16">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16 gray">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <a-badge :count="topic.fact.total">
                                        <a-avatar v-if="topic.media && topic.media.id" shape="square" style="width: 150px; height: 150px;">
                                            <img :src="api_domain + topic.media.thumbnails.thumb_150_150">
                                        </a-avatar>
                                        <a-avatar v-else shape="square" icon="tag"/>
                                    </a-badge>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h3 class="ant-list-item-meta-title">{{topic.name}}</h3>
                                    <div class="ant-list-item-meta-description">
                                        <p>{{topic.description}}</p>
                                    </div>
                                </div>
                            </div>
                        </a-card>
                        <a-card :bordered="false" :body-style="{padding: 0}">
                            <h1 class="uppercase">{{capitalizeFirst(this.title)}}</h1>
                            <FactList :data="topic.fact" :query="query" :page-size="10"/>
                        </a-card>
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
