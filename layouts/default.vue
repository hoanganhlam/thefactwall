<template>
    <a-layout id="components-layout-demo-fixed">
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <n-link to="/" class="logo">
                <img src="/logo.jpg" alt="">
            </n-link>
            <a-menu
                theme="dark"
                mode="horizontal"
                :defaultSelectedKeys="['0']"
                :style="{ lineHeight: '45px', float: 'left' }">
                <a-menu-item key="1">
                    <n-link to="/reaction/wtf">WTF</n-link>
                </a-menu-item>
                <a-menu-item key="2">
                    <n-link to="/reaction/interesting">Interesting</n-link>
                </a-menu-item>
                <a-menu-item key="3">
                    <n-link to="/reaction/unbelievable">Unbelievable</n-link>
                </a-menu-item>
                <a-menu-item key="4">
                    <n-link to="/reaction/fun">Fun</n-link>
                </a-menu-item>
            </a-menu>
            <div style="float: right">
                <a-button @click="visible = true" type="primary">
                    <a-icon type="edit" /> Post</a-button>
            </div>
        </a-layout-header>
        <a-layout-content class="master">
            <div class="container">
                <nuxt/>
            </div>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
            Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
        <a-drawer
            title="SHARE THE TRUTH"
            :width="520"
            :visible="visible"
            @close="visible = false"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
            <PostFact/>
        </a-drawer>
    </a-layout>
</template>

<script>
    import PostFact from '../components/fact/Post'

    export default {
        data() {
            return {
                visible: false,
            }
        },
        components: {
            PostFact
        }
    }
</script>

<style lang="scss">

</style>
