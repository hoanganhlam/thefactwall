<template>
    <div>
        <a-layout>
            <a-row :gutter="16">
                <a-col class="gutter-row" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card :bordered="false" :body-style="{padding: 0}">
                            <h1>{{capitalizeFirst(this.title)}}</h1>
                            <FactList :data="fact" :query="query" :page-size="10"/>
                        </a-card>
                    </a-layout-content>
                </a-col>
                <a-col class="gutter-row" :md="8" :xs="24">
                    <a-layout-sider width="100%">

                    </a-layout-sider>
                </a-col>
            </a-row>
        </a-layout>
    </div>
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
            let res = await app.$axios.$get(`/fact/facts/?page_size=10&reaction=${action}`)
            query.action = action
            return {
                fact: res,
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
