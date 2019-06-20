<template>
    <div>
        <a-layout>
            <TopicList label="hot" :data="home.hot_topic"></TopicList>
        </a-layout>
        <a-layout>
            <a-row :gutter="16">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <FactNew :data="home.new_fact"/>
                    <h4 class="uppercase">Popular Facts</h4>
                    <FactList :data="home.hot_fact"/>
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
            let home = await app.$axios.$get('/fact/home/')
            return {
                home
            }
        }
    }
</script>

<style scoped>

</style>
