<template>
    <div class="ant-list ant-list-vertical ant-list-lg ant-list-split">
        <div class="fact-card bt_16" v-for="fact in facts" :key="fact.id">
            <a-skeleton :loading="loading" active avatar>
                <FactCard :fact="fact"/>
            </a-skeleton>
        </div>
        <a-card class="gray" :body-style="{padding: 0}" :bordered="false" v-if="pageSize < data.total">
            <pagination :current="current" :base-url="'?page='" :perPage="pageSize" :total="data.total"/>
        </a-card>
    </div>
</template>

<script>
    import FactCard from './Card'

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
            pageSize: {
                type: Number,
                default: 10
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        components: {
            FactCard
        },
        data() {
            return {
                facts: this.data.results
            }
        },
        computed: {
            current() {
                return this.$route.query.page || 1
            }
        },
        watch: {
            data() {
                this.facts = []
                this.facts = this.data.results
            }
        }
    }
</script>

<style scoped>

</style>
