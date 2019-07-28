<template>
    <div class="topics">
        <div v-if="lastPage" class="previous" @click="previous()">
            <a-icon type="double-left"/>
        </div>
        <a-row :gutter="16">
            <a-col class="bt_16" :md="md" :sm="sm" :xs="xs" v-for="topic in res.results" :key="topic.id">
                <TopicCard :topic="topic" :icon="icon" :label="label"/>
            </a-col>
        </a-row>
        <div v-if="lastPage" class="next" @click="next()">
            <a-icon type="double-right"/>
        </div>
    </div>
</template>

<script>
    import TopicCard from './Card'

    export default {
        name: "List",
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
            query: {
                type: Object,
                default: () => {
                    return {
                        page: 1
                    }
                }
            },
            pageSize: {
                type: Number,
                default: 6
            },
            md: {
                type: Number,
                default: 4
            },
            sm: {
                type: Number,
                default: 8
            },
            xs: {
                type: Number,
                default: 12
            },
            label: {
                type: String,
                default: null
            },
            icon: {
                type: String,
                default: 'rise'
            }
        },
        components: {
            TopicCard,
        },
        data() {
            return {
                res: this.data,
                current: this.query.page
            }
        },
        methods: {
            async next() {
                if (this.current === this.lastPage) {
                    this.current = 1
                } else {
                    this.current = this.current + 1
                }
                await this.fetch()
            },
            async previous() {
                if (this.current === 1) {
                    this.current = this.lastPage
                } else {
                    this.current = this.current - 1
                }
                await this.fetch()
            },
            async fetch() {
                this.res = await this.$api.taxonomy.list({pageSize: this.pageSize, page: this.current})
            }
        },
        computed: {
            lastPage() {
                return Math.floor(this.res.total / this.pageSize)
            }
        }
    }
</script>

<style lang="scss">
</style>
