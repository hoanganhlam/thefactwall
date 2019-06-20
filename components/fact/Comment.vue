<template>
    <div>
        <a-comment v-if="$auth.loggedIn">
            <div slot="avatar" class="ant-avatar ant-avatar-circle ant-avatar-image">
                <img v-if="$auth.user.avatar && $auth.user.avatar.id" :alt="$auth.user.username"
                     :src="api_domain + $auth.user.avatar.thumbnails.thumb_150_150">
                <img alt="Empty Avatar" v-else src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
            </div>
            <div slot="content">
                <a-form-item>
                    <a-textarea :rows="3" v-model="form.content"></a-textarea>
                </a-form-item>
                <a-form-item>
                    <a-button
                        htmlType="submit"
                        :loading="submitting" @click="handleSubmit"
                        type="primary">Add Comment
                    </a-button>
                </a-form-item>
            </div>
        </a-comment>
        <h4>Comments</h4>
        <a-comment v-for="comment in results" :key="comment.id">
            <n-link slot="author" :to="`/member/${comment.user.username}`">{{convertName(comment.user)}}</n-link>
            <div slot="avatar" class="ant-avatar ant-avatar-circle ant-avatar-image">
                <img v-if="comment.user.avatar && comment.user.avatar.id" :alt="comment.user.username"
                     :src="api_domain + comment.user.avatar.thumbnails.thumb_150_150">
                <img alt="Empty Avatar" v-else src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
            </div>
            <p slot="content">{{comment.content}}</p>
        </a-comment>
    </div>
</template>

<script>
    export default {
        name: "Comment",
        props: {
            factId: {},
            response: {

            }
        },
        data() {
            return {
                form: {
                    content: null
                },
                submitting: false,
                total: this.response.total,
                results: this.response.results
            }
        },
        methods: {
            async handleSubmit() {
                this.submitting = true
                this.form.fact = this.factId
                let res = await this.$axios.$post('/fact/comments/', this.form)
                this.results.push(res)
                this.submitting = false
            }
        }
    }
</script>

<style scoped>

</style>
