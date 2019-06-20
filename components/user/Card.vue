<template>
    <div class="ant-list-item-meta">
        <div class="ant-list-item-meta-avatar">
            <div class="ant-avatar ant-avatar-circle ant-avatar-image">
                <img v-if="user.avatar && user.avatar.id" :alt="user.username"
                     :src="api_domain + user.avatar.thumbnails.thumb_150_150">
                <img alt="Empty Avatar" v-else src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
            </div>
        </div>
        <div class="ant-list-item-meta-content">
            <h4 class="ant-list-item-meta-title">
                <nuxt-link :to="`/member/${user.username}/`">{{convertName(user)}}</nuxt-link>
            </h4>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            user: {

            }
        }
    }
</script>

<style scoped>

</style>
