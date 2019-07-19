<template>
    <div>
        <a-layout>
            <TopicList label="trending" :data="home.hotTopic"/>
        </a-layout>
        <a-layout>
            <FactNew :data="home.hotFact" class="bt_16"/>
        </a-layout>
        <a-layout>
            <div class="container">
                <a-row :gutter="16">
                    <a-col class="gutter-row bt_16" :md="16" :xs="24">
                        <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                            <FactList :data="home.newFact" :query="{ordering: 'newest'}"/>
                        </a-card>
                    </a-col>
                    <a-col class="gutter-row" :md="8" :xs="24">
                        <a-layout-sider width="100%">
                            <a-card title="Contributors" class="bt_16">
                                <user-card
                                    class="bt_16"
                                    v-for="contributor in home.contributor.results"
                                    :key="contributor.id"
                                    :user="contributor"/>
                            </a-card>
                            <a-card class="gray bt_16" :body-style="{padding: 0}">
                                <a-card :bordered="false">
                                    <h4>
                                        <n-link to="/onthisday">On this day</n-link>
                                    </h4>
                                </a-card>
                                <a-card
                                    :bordered="false"
                                    v-for="fact in home.otd.results"
                                    :key="fact.id"
                                    class="fact-card gray">
                                    <span class="ant-tag">{{moment(fact.date).year()}}</span>
                                    <span>{{fact.contentShort}}</span>
                                </a-card>
                            </a-card>
                        </a-layout-sider>
                    </a-col>
                </a-row>
            </div>
        </a-layout>
    </div>
</template>

<script>
    import TopicList from '../components/topic/List'
    import FactList from '../components/fact/List'
    import FactNew from '../components/fact/New'

    const moment = require('moment')
    export default {
        name: "index",
        components: {
            TopicList, FactList, FactNew
        },
        head() {
            return {
                title: 'TheFactWall.com - Place of truth'
            }
        },
        async asyncData({app}) {
            let today = new moment()
            let query = {
                day: today.date(),
                month: today.month() + 1
            }
            let {n, p, t, c, d} = await app.$axios.$get('/home/', {params: query})
            return {
                home: {
                    hotTopic: t,
                    newFact: n,
                    hotFact: p,
                    contributor: c,
                    otd: d
                }
            }
        }
    }
</script>

<style scoped>

</style>
