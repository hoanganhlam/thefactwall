<template>
    <div></div>
</template>

<script>
    export default {
        name: "test",
        methods: {
            async taxonomy(page) {
                let oldRes = await this.$axios.$get('http://api.thefactwall.com/v1/fact/topics/?page=' + page)
                for (let i = 0; i < oldRes.results.length; i++) {
                    let test = await this.$axios.$post('/taxonomies/', {
                        title: oldRes.results[i].name,
                        slug: oldRes.results[i].slug,
                        description: oldRes.results[i].description,
                        isPublic: oldRes.results[i].is_public,
                        isObject: oldRes.results[i].is_object
                    })
                }
            },
            async fact(page) {
                let oldRes = await this.$axios.$get('http://api.thefactwall.com/v1/fact/facts/?page=' + page)
                for (let i = 0; i < oldRes.results.length; i++) {
                    await this.$axios.$post('/facts/', {
                        contentShort: oldRes.results[i].short,
                        contentLong: oldRes.results[i].log,
                        date: oldRes.results[i].date,
                        taxSlugs: oldRes.results[i].topics.map(x => x.slug),
                        source: oldRes.results[i].source
                    })
                }
            }
        },
        async created() {
            let page = this.$route.query.page || 1
            let kind = this.$route.query.kind || 'fact'
            if (kind === 'fact') {
                await this.fact(page)
            } else {
                await this.taxonomy(page)
            }

        }
    }
</script>

<style scoped>

</style>
