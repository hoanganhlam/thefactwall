<template>
    <div class="ant-card fact-card success">
        <div class="ant-card-head">
            <div class="ant-card-head-wrapper">
                <a-row type="flex" justify="space-around" align="middle" style="width: 100%;">
                    <a-col :md="4" :xs="8">
                        <a-button-group>
                            <a-button @click="handle_click(true)">
                                <a-icon type="left"/>
                            </a-button>
                            <a-button @click="handle_click(false)">
                                <a-icon type="right"/>
                            </a-button>
                        </a-button-group>
                    </a-col>
                    <a-col :md="20" :xs="16">
                        <div v-for="fact in facts" :key="fact._id">
                            <div class="bt_16">
                                <q>
                                    <n-link :to="`/${fact._id}`">{{fact.contentShort}}</n-link>
                                </q>
                            </div>
                            <div class="tags">
                                <nuxt-link
                                    v-for="topic in fact.taxonomies" :key="topic._id" class="ant-tag"
                                    :to="`/topic/${topic.slug}/`">
                                    <a-icon type="tag"/>
                                    <span>{{topic.title}}</span>
                                </nuxt-link>
                                <nuxt-link style="float: right" class="ant-tag" :to="`/member/${fact.user.username}`">
                                    <a-icon type="user"/>
                                    <span>{{convertName(fact.user)}}</span>
                                </nuxt-link>
                            </div>
                        </div>
                    </a-col>
                    <span class="label">New</span>
                </a-row>
            </div>
        </div>
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
                current: 1
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
                    pageSize: 1,
                    ordering: 'newest',
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
