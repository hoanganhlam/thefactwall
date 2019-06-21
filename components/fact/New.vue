<template>
    <a-card class="bt_16">
        <a-row type="flex" justify="space-around" align="middle">
            <a-col :md="5" :xs="8">
                <a-button-group>
                    <a-button @click="handle_click(true)">
                        <a-icon type="left"/>
                    </a-button>
                    <a-button @click="handle_click(false)">
                        <a-icon type="right"/>
                    </a-button>
                </a-button-group>
            </a-col>
            <a-col :md="19" :xs="16">
                <div v-for="fact in facts" :key="fact.id">
                    <div>
                        <a-tag>
                            <nuxt-link :to="`/member/${fact.user.username}`">{{convertName(fact.user)}}</nuxt-link>
                        </a-tag>
                    </div>
                    <q style="font-size: 25px">{{fact.short}}</q>
                </div>
            </a-col>
            <span class="label">New</span>
        </a-row>
    </a-card>
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
                let query = '?page_size=1&ordering=-id&page=' + this.current
                let res = await this.$axios.$get(`/fact/facts/${query}`)
                this.total = res.total
                this.facts = res.results
            },
        }
    }
</script>

<style scoped>

</style>
