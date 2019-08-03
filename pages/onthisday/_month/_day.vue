<template>
    <div class="container">
        <a-row :gutter="20" type="flex" justify="center">
            <a-col class="gutter-row" :md="16" :xs="24">
                <a-card class="bt_16">
                    <a-button-group style="width: 100%">
                        <n-link :to="previous" class="ant-btn ant-btn-primary" style="width: 50%">
                            <a-icon type="left"/>
                            <span>Previous</span>
                        </n-link>
                        <n-link :to="next" class="ant-btn ant-btn-primary" style="width: 50%">
                            <span>Next</span>
                            <a-icon type="right"/>
                        </n-link>
                    </a-button-group>
                </a-card>
                <a-layout-content :style="{ minHeight: '700px' }">
                    <a-card class="bt_16">
                        <div class="ant-list-item-meta">
                            <div class="ant-list-item-meta-avatar">
                                <a-badge :count="res.total">
                                    <a-avatar shape="square" icon="calendar"/>
                                </a-badge>
                            </div>
                            <div class="ant-list-item-meta-content">
                                <h1 class="ant-list-item-meta-title">{{title}} Facts</h1>
                            </div>
                        </div>
                    </a-card>
                    <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                        <FactList :data="res" :query="query" :page-size="10"/>
                    </a-card>
                </a-layout-content>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import FactList from '../../../components/fact/List'
    import moment from "moment";

    export default {
        head() {
            return {
                title: this.capitalizeFirst(this.title)
            }
        },
        name: 'OnThisDay',
        watchQuery: true,
        async asyncData({app, params, query}) {
            let qStr = '', title = ''
            let today = new moment()
            if (typeof params.month === 'undefined' && typeof params.day === 'undefined') {
                query.day = today.date()
                query.month = today.month() + 1
                title = 'On This Day'
            } else if (params.month && params.day) {
                query.month = params.month
                query.day = params.day
                today = today.month(params.month - 1)
                today = today.date(params.day)
                title = today.format('MMMM Do')
            } else if (params.month) {
                today = today.month(params.month - 1)
                query.month = params.month
                title = today.format('MMMM')
            }
            query.pageSize = 10
            let res = await app.$api.fact.list(query)
            return {
                res: res,
                title,
                query: query,
                today
            }
        },
        data() {
            return {}
        },
        components: {
            FactList
        },
        methods: {},
        computed: {
            next() {
                let next = moment(this.today).add(1, 'd')
                return `/onthisday/${next.month() + 1}/${next.date()}`
            },
            previous() {
                let previous = moment(this.today).subtract(1, 'd')
                return `/onthisday/${previous.month() + 1}/${previous.date()}`
            }
        }
    }
</script>

<style>
</style>
