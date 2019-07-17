<template>
    <a-layout id="components-layout-demo-fixed">
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <n-link to="/" class="logo">
                <img src="/logo.jpg" alt="">
            </n-link>
            <a-menu theme="dark" mode="horizontal" v-model="current"
                    :style="{ lineHeight: '45px', float: 'left' }">
                <a-menu-item key="/">
                </a-menu-item>
                <a-menu-item key="/reaction/wtf">
                    <n-link to="/reaction/wtf">WTF</n-link>
                </a-menu-item>
                <a-menu-item key="/reaction/interesting">
                    <n-link to="/reaction/interesting">Interesting</n-link>
                </a-menu-item>
                <a-menu-item key="/reaction/unbelievable">
                    <n-link to="/reaction/unbelievable">Unbelievable</n-link>
                </a-menu-item>
                <a-menu-item key="/reaction/fun">
                    <n-link to="/reaction/fun">Fun</n-link>
                </a-menu-item>
                <a-menu-item key="/onthisday">
                    <n-link to="/onthisday">On This Day</n-link>
                </a-menu-item>
            </a-menu>
            <div style="float: right">
                <a-button @click="visible = true" type="primary">
                    <a-icon type="edit"/>
                    Post
                </a-button>
                <n-link v-if="$auth.loggedIn" class="ant-btn" to="/member/me">
                    <a-icon type="user"/>
                </n-link>
            </div>
        </a-layout-header>
        <a-layout-content class="master">
            <div class="container">
                <nuxt/>
            </div>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">TheFactWall.com ©2018</a-layout-footer>
        <a-drawer
            title="SHARE THE TRUTH"
            :width="520"
            :visible="visible"
            @close="visible = false"
            :wrapStyle="{overflow: 'auto'}">
            <PostFact/>
        </a-drawer>
    </a-layout>
</template>

<script>
    import PostFact from '../components/fact/Post'

    export default {
        data() {
            let current = [this.$route.path]
            return {
                visible: false,
                current
            }
        },
        components: {
            PostFact
        }
    }
</script>

<style lang="scss">

</style>
