<template>
    <div class="container">
        <a-row :gutter="20" type="flex" justify="center">
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
                        <h1 style="font-size: 30px; line-height: 1">{{capitalizeFirst(title)}}</h1>
                        <FactList :data="fact" :query="query" :page-size="10"/>
                    </a-card>
                    <h4 class="center">Contributors</h4>
                    <a-card class="bt_16">
                        <a-row>
                            <a-col v-for="contributor in contributors" :key="contributor.id" :span="6" :xs="12">
                                <user-card :user="contributor"/>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-layout-content>
            </a-col>
        </a-row>
    </div>
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
            let res = await app.$api.taxonomy.get(params.slug, query)
            if (typeof params.sub === 'undefined') {
                params.sub = 'facts'
            } else {
                params.sub = params.sub + ' facts'
            }
            return {
                topic: res.instance,
                title: params.sub + ' about ' + res.instance.title,
                query: query,
                fact: res.fact,
                contributors: res.contributors,
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
