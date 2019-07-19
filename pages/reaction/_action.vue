<template>
    <a-layout>
        <div class="container">
            <a-row :gutter="16">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                            <a-card class="bt_16">
                                <div class="ant-list-item-meta">
                                    <div class="ant-list-item-meta-avatar">
                                        <a-badge :count="res.total">
                                            <a-avatar shape="square" icon="calendar"/>
                                        </a-badge>
                                    </div>
                                    <div class="ant-list-item-meta-content">
                                        <h1 class="ant-list-item-meta-title">{{capitalizeFirst(title)}}</h1>
                                    </div>
                                </div>
                            </a-card>
                            <FactList :data="res" :query="query" :page-size="10"/>
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

    export default {
        head() {
            return {
                title: this.capitalizeFirst(this.title)
            }
        },
        async asyncData({app, params, query}) {
            let action = '1'
            let title = ''
            switch (params.action) {
                case 'wtf':
                    action = '1'
                    title = 'WTF Facts'
                    break
                case 'wow':
                    action = '1'
                    title = 'Wow Facts'
                    break
                case 'interesting':
                    action = '2'
                    title = 'Interesting Facts'
                    break
                case 'unbelievable':
                    action = '1,2'
                    title = 'Unbelievable Facts'
                    break
                case 'fun':
                    action = '3'
                    title = 'Fun Facts'
                    break
                case 'bored':
                    action = '4'
                    title = 'Bored Facts'
                    break
            }
            query.action = action
            query.pageSize = 10
            let res = await app.$api.fact.list(query)
            return {
                res: res,
                title: title,
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
