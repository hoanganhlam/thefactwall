<template>
    <a-layout>
        <div class="container">
            <a-row :gutter="20">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16">
                            <div class="ant-list-item-meta">
                                <div class="ant-list-item-meta-avatar">
                                    <a-badge :count="fact.total">
                                        <a-avatar v-if="topic.media && topic.media.id" shape="square"
                                                  style="width: 150px; height: 150px;">
                                            <img :src="api_domain + topic.media.thumbnails.thumb_150_150">
                                        </a-avatar>
                                        <a-avatar v-else shape="square" icon="tag"/>
                                    </a-badge>
                                </div>
                                <div class="ant-list-item-meta-content">
                                    <h3 class="ant-list-item-meta-title">{{topic.title}}</h3>
                                    <div class="ant-list-item-meta-description">
                                        <Editable
                                            v-if="$auth.loggedIn"
                                            :text="topic.description"
                                            @change="handleUpdate(topic.slug, 'description', $event)"/>
                                    </div>
                                </div>
                            </div>
                        </a-card>
                        <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                            <h1 style="font-size: 18px">{{capitalizeFirst(title)}}</h1>
                            <FactList :data="fact" :query="query" :page-size="10"/>
                        </a-card>
                    </a-layout-content>
                </a-col>
                <a-col class="gutter-row" :md="8" :xs="24">
                    <a-layout-sider width="100%">
                        <a-card title="Contributors" class="bt_16">
                            <user-card
                                class="bt_16"
                                v-for="contributor in contributors"
                                :key="contributor.id"
                                :user="contributor"/>
                        </a-card>
                    </a-layout-sider>
                </a-col>
            </a-row>
        </div>
    </a-layout>
</template>

<script>
    import FactList from '../../../components/fact/List'
    import Editable from '../../../components/generic/Editable'

    export default {
        head() {
            return {
                title: this.capitalizeFirst(this.title)
            }
        },
        watchQuery: true,
        async asyncData({app, params, query}) {
            let {instance, contributors} = await app.$api.taxonomy.get(params.slug)
            if (typeof params.sub === 'undefined') {
                params.sub = 'facts'
            } else {
                params.sub = params.sub + ' facts'
            }
            query.taxonomy = instance._id
            let fact = await app.$api.fact.list(
                {
                    pageSize: 10,
                    page: query.page || 1,
                    taxonomy: instance._id
                })
            return {
                topic: instance,
                title: params.sub + ' about ' + instance.title,
                query: query,
                fact,
                contributors
            }
        },
        data() {
            return {}
        },
        methods: {
            async handleUpdate(id, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                this.topic = await this.$api.taxonomy.update(id, data)
            },
        },
        components: {
            FactList, Editable
        }
    }
</script>

<style>
</style>
