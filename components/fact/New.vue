<template>
    <div class="container">
        <a-row class="bt_16" :gutter="16">
            <a-col :md="12" :xs="12">
                <h3 class="uppercase">Popular Facts</h3>
            </a-col>
            <a-col :md="12" :xs="12">
                <a-button-group style="float: right">
                    <a-button @click="handle_click(true)">
                        <a-icon type="left"/>
                    </a-button>
                    <a-button @click="handle_click(false)">
                        <a-icon type="right"/>
                    </a-button>
                </a-button-group>
            </a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col class="new-fact" :md="8" :xs="24" v-for="(fact, i) in facts" :key="fact._id">
                <a-card class="fact-card bt_16" v-bind:style="styles[i]">
                    <div class="ant-card-head-wrapper">
                        <div class="wrapper">
                            <div class="content bt_16">
                                <nuxt-link
                                    v-for="topic in fact.taxonomies" :key="topic._id" class="ant-tag"
                                    :to="`/topic/${topic.slug}/`">
                                    <a-icon type="tag"/>
                                    <span>{{topic.title}}</span>
                                </nuxt-link>
                                <q>
                                    <n-link :to="`/${fact._id}`">{{fact.contentShort}}</n-link>
                                </q>
                            </div>
                            <div class="tags">
                                <nuxt-link style="float: right" class="ant-tag" :to="`/member/${fact.user.username}`">
                                    <a-icon type="user"/>
                                    <span>{{convertName(fact.user)}}</span>
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "New",
        props: {
            data: {
                type: Object,
                default: () => {
                    return {
                        total: 0,
                        results: []
                    }
                }
            },
        },
        data() {
            return {
                total: this.data.total,
                facts: this.data.results,
                current: 1,
                styles: [
                    {
                        backgroundImage: 'linear-gradient(to left, #9bda81, #26b07a)'
                    },
                    {
                        backgroundImage: 'linear-gradient(to left, #fed44b, #ffaa43)'
                    },
                    {
                        backgroundImage: 'linear-gradient(to left, #bf8ee4, #574f84)'
                    }
                ]
            }
        },
        methods: {
            async handle_click(flag) {
                if (flag) {
                    if (this.current === 1) {
                        this.current = this.total
                    } else if (this.current > 1) {
                        this.current = this.current - 1
                    }
                } else {
                    if (this.current === this.total) {
                        this.current = 1
                    } else if (this.current < this.total) {
                        this.current = this.current + 1
                    }
                }
                await this.fetch()
            },
            async fetch() {
                let query = {
                    pageSize: 3,
                    ordering: 'popular',
                    page: this.current
                }
                let res = await this.$api.fact.list(query)
                this.total = res.total
                this.facts = res.results
            },
        }
    }
</script>

<style scoped>

</style>
