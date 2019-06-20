<template>
    <div class="ant-list ant-list-vertical ant-list-lg ant-list-split bt_16">
        <a-skeleton v-for="fact in facts" :key="fact.id" :loading="loading" active avatar>
            <FactCard :fact="fact"/>
        </a-skeleton>
        <a-pagination
            v-if="pageSize  * current < total"
            :pageSize="pageSize" style="margin: 32px 0"
            :total="total"
            @change="handle_change"/>
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
                let query = '?page_size=' + this.pageSize
                this.queryTemp.page = page
                for (let field in this.queryTemp) {
                    if (this.queryTemp[field]) {
                        query = query + `&${field}=${this.queryTemp[field]}`
                    }
                }
                let res = await this.$axios.$get(`/fact/facts/${query}`)
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
