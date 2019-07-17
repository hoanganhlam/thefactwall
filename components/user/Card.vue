<template>
    <div class="ant-list-item-meta">
        <div class="ant-list-item-meta-avatar">
            <div class="ant-avatar ant-avatar-circle ant-avatar-image">
                <img v-if="avatar && avatar._id" :alt="user.username"
                     :src="'/' + avatar.size['100_100']">
                <a-avatar v-else shape="square" icon="user"/>
            </div>
        </div>
        <div class="ant-list-item-meta-content">
            <h4 class="ant-list-item-meta-title">
                <nuxt-link :to="`/member/${user.username}/`">{{convertName(user)}}</nuxt-link>
            </h4>
            <slot></slot>
        </div>
        <slot name="right"></slot>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            user: {

            }
        },
        computed: {
            avatar() {
                if (this.user.avatar) {
                    if (this.user.avatar._id) {
                        return this.user.avatar
                    } else if (this.user.avatar.length) {
                        return this.user.avatar[0]
                    }
                }
                return null
            }
        }
    }
</script>

<style scoped>

</style>
