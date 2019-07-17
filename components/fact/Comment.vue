<template>
    <div>
        <div class="bt_16" v-if="$auth.loggedIn">
            <a-form-item class="bt_16">
                <a-textarea :rows="2" v-model="form.content"></a-textarea>
            </a-form-item>
            <a-row>
                <a-col :md="12">
                    <user-card class="bt_16" :user="this.$auth.user">
                    </user-card>
                </a-col>
                <a-col :md="12">
                    <a-button
                        style="float: right"
                        htmlType="submit"
                        :loading="submitting" @click="handleSubmit"
                        type="primary">Add Comment
                    </a-button>
                </a-col>
            </a-row>
        </div>
        <h4>Comments</h4>
        <a-comment v-for="comment in results" :key="comment.id">
            <n-link slot="author" :to="`/member/${comment.user.username}`">{{convertName(comment.user)}}</n-link>
            <div slot="avatar" class="ant-avatar ant-avatar-circle ant-avatar-image">
                <img alt="Empty Avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
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
                total: this.response.results.length,
                results: this.response.results
            }
        },
        methods: {
            async handleSubmit() {
                this.submitting = true
                let res = await this.$api.fact.comment(this.factId, this.form)
                this.results.push(res)
                this.submitting = false
            }
        }
    }
</script>

<style scoped>

</style>
