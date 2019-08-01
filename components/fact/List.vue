<template>
    <div class="ant-list ant-list-vertical ant-list-lg ant-list-split">
        <div class="fact-card bt_16" v-for="fact in facts" :key="fact.id">
            <a-skeleton :loading="loading" active avatar>
                <FactCard :fact="fact"/>
            </a-skeleton>
        </div>
        <a-card class="gray" :body-style="{padding: 0}" :bordered="false" v-if="pageSize  * current < total">
            <pagination
                :base-url="'?page='"
                :perPage="pageSize"
                :total="total"
                @change="handle_change"/>
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
            }
        },
        components: {
            FactCard
        },
        data() {
            return {
                total: this.data.total,
                facts: this.data.results,
                current: this.query.page || 1,
                queryTemp: this.query,
                loading: false
            }
        },
        methods: {
            async fetch(page) {
                this.loading = true
                this.queryTemp.pageSize =  this.pageSize
                this.queryTemp.page = page
                let res = await this.$api.fact.list(this.queryTemp)
                this.total = res.total
                this.facts = res.results
                this.loading = false
            },
            handle_change(page) {
                this.fetch(page)
            }
        }
    }
</script>

<style scoped>

</style>
