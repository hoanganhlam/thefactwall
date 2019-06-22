<template>
    <a-row :gutter="16">
        <a-col class="bt_16" :md="md" :sm="sm" :xs="xs" v-for="topic in topics" :key="topic.id">
            <TopicCard :topic="topic" :icon="icon" :label="label"/>
        </a-col>
    </a-row>
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
                default: 10
            },
            md: {
                type: Number,
                default: 6
            },
            sm: {
                type: Number,
                default: 12
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
                total: this.data.total,
                topics: this.data.results,
                current: this.query.page
            }
        },
    }
</script>

<style scoped>

</style>
