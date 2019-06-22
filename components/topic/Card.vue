<template>
    <a-card hoverable>
        <img slot="cover" v-if="topic.media && topic.media.id" :alt="topic.name"
             :src="api_domain + topic.media.thumbnails.thumb_200_250">
        <img slot="cover" alt="Empty Avatar" v-else src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
        <a-card-meta>
            <h3 slot="description">
                <n-link :to="`/topic/${topic.slug}/`">{{topic.name}}</n-link>
            </h3>
        </a-card-meta>
        <span v-if="label" class="label"><a-icon :type="icon" /> {{label}}</span>
    </a-card>
</template>

<script>
    export default {
        name: "Card",
        props: {
            topic: {

            },
            label: {
                type: String,
                default: null
            },
            icon: {
                type: String,
                default: 'rise'
            }

        }
    }
</script>

<style scoped>

</style>
