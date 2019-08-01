<template>
    <div>
        <a-layout>
            <TopicList label="trending" :data="home.hotTopic"/>
        </a-layout>
        <a-layout>
            <div class="container">
                <a-row :gutter="20">
                    <a-col class="gutter-row" :md="8" :xs="24">
                        <a-layout-sider width="100%">
                            <FactNew :data="home.hotFact" class="bt_16"/>
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
                    <a-col class="gutter-row bt_16" :md="16" :xs="24">
                        <h4 class="uppercase">
                            <n-link to="/random/">Random facts</n-link>
                        </h4>
                        <FactCard v-if="home.random" class="bt_16 fact-card" :fact="home.random"></FactCard>
                        <h4 class="uppercase">New facts</h4>
                        <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                            <FactList :data="home.newFact" :query="{ordering: 'newest'}"/>
                        </a-card>
                    </a-col>
                </a-row>
            </div>
        </a-layout>
    </div>
</template>

<script>
    import FactCard from '../components/fact/Card'
    import TopicList from '../components/topic/List'
    import FactList from '../components/fact/List'
    import FactNew from '../components/fact/New'

    const moment = require('moment')
    export default {
        name: "index",
        components: {
            TopicList, FactList, FactNew, FactCard
        },
        head() {
            return {
                title: 'TheFactWall.com - Place of truth'
            }
        },
        watchQuery: true,
        async asyncData({app, query}) {
            let today = new moment()
            query['day'] = today.date()
            query['month'] = today.month() + 1
            let {n, p, t, c, d, r} = await app.$axios.$get('/home/', {params: query})
            return {
                home: {
                    hotTopic: t,
                    newFact: n,
                    hotFact: p,
                    contributor: c,
                    otd: d,
                    random: r
                }
            }
        }
    }
</script>

<style scoped>

</style>
