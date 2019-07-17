<template>
    <div>
        <a-layout>
            <TopicList class="bt_16" label="trending" :data="home.hotTopic"/>
        </a-layout>
        <a-layout>
            <a-row :gutter="16">
                <a-col :md="24">
                    <FactNew :data="home.newFact"/>
                </a-col>
                <a-col class="gutter-row bt_16" :md="16" :xs="24">

                    <a-card class="gray" :bordered="false" :body-style="{padding: 0}">
                        <h4 class="uppercase">Popular Facts</h4>
                        <FactList :data="home.hotFact" :query="{ordering: 'popular'}"/>
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
                            <!--<a-card-->
                            <!--:bordered="false"-->
                            <!--v-for="fact in home.today.results"-->
                            <!--:key="fact.id"-->
                            <!--class="fact-card gray">-->
                            <!--<span class="ant-tag">{{moment(fact.date).year()}}</span>-->
                            <!--<span>{{fact.short}}</span>-->
                            <!--</a-card>-->
                        </a-card>
                    </a-layout-sider>
                </a-col>
            </a-row>
        </a-layout>
    </div>
</template>

<script>
    import TopicList from '../components/topic/List'
    import FactList from '../components/fact/List'
    import FactNew from '../components/fact/New'

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
            let {n, p, t, c} = await app.$axios.$get('/home/')
            return {
                home: {
                    hotTopic: t,
                    newFact: n,
                    hotFact: p,
                    contributor: c
                }
            }
        }
    }
</script>

<style scoped>

</style>
