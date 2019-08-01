<template>
    <a-card class="topic-card" hoverable>
        <img slot="cover" v-if="topic.tempPhotos && topic.tempPhotos.length" :alt="topic.title"
             :src="'/' + topic.tempPhotos[0].size['210_260']">
        <img slot="cover" alt="Empty Avatar" v-else src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
        <a-card-meta>
            <h3 slot="description">
                <n-link :to="`/topic/${topic.slug}/`">{{topic.title}}</n-link>
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
