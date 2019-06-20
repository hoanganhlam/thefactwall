<template>
    <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="18">
            <LoginForm v-if="!$auth.loggedIn"/>
            <a-form
                v-else
                layout="vertical"
                id="components-form-demo-normal-login"
                :form="factForm"
                class="login-form"
                @submit="handleSubmit">
                <div class="ant-row ant-form-item">
                    <div class="ant-form-item-label">
                        <label title="Topics" class="">Topics</label>
                        <span style="cursor: pointer; float: right" @click="visible = true">
                            <a-icon type="plus"/> add
                        </span>
                    </div>
                    <div class="ant-form-item-control-wrapper">
                        <div class="ant-form-item-control">
                            <div class="ant-form-item-children">
                                <a-select
                                    mode="multiple"
                                    :value="selectedTopic"
                                    placeholder="Select topics"
                                    style="width: 100%"
                                    :filterOption="false"
                                    @search="fetchTopic"
                                    @change="handleChange"
                                    :notFoundContent="fetching ? undefined : null">
                                    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                                    <a-select-option v-for="d in topics" :key="d.id">{{d.name}}</a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </div>
                </div>
                <a-form-item label="Title">
                    <a-textarea
                        v-decorator="['short',{rules: [{ required: true, message: 'Please input summary!' }]}]"
                        placeholder="Title or summary" autosize/>
                </a-form-item>
                <a-form-item label="More detail.....">
                    <a-textarea v-decorator="['long']" placeholder="fact's detail" :autosize="{ minRows: 3 }"/>
                </a-form-item>
                <a-form-item label="Source">
                    <a-card>
                        <a-input @blur="fetchUrl" v-model="source.url" placeholder="https://..."/>
                        <a-divider>or</a-divider>
                        <a-input v-model="source.title" style="margin-bottom: 10px" placeholder="From..."/>
                        <a-textarea v-model="source.description" placeholder="Description..."
                                    :autosize="{ minRows: 2 }"/>
                    </a-card>
                </a-form-item>
                <a-form-item label="Photo">
                    <Uploader @uploaded="photo = $event"/>
                </a-form-item>
                <a-form-item>
                    <a-button class="full-width" type="primary" html-type="submit">Post</a-button>
                </a-form-item>
            </a-form>
        </a-col>
        <a-modal title="Create topic" :visible="visible" @cancel="visible = false" @ok="createTopic">
            <a-input v-model="topicName" placeholder="Something..."/>
        </a-modal>
    </a-row>
</template>

<script>
    import LoginForm from '../user/Login'
    import Uploader from '../media/Uploader'
    import debounce from 'lodash/debounce';

    export default {
        name: "Post",
        beforeCreate() {
            this.factForm = this.$form.createForm(this);
        },
        data() {
            this.fetchTopic = debounce(this.fetchTopic, 800);
            return {
                topics: [],
                selectedTopic: [],
                fetching: false,
                photo: null,
                source: {
                    url: null,
                    title: null,
                    description: null
                },
                visible: false,
                topicName: null
            }
        },

        methods: {
            fetchTopic(value) {
                this.data = []
                this.fetching = true
                this.$axios.$get(`/fact/topics/?search=${value}`).then(res => {
                    this.topics = res.results
                    this.fetching = false
                })
            },
            handleSubmit(e) {
                let _this = this
                e.preventDefault();
                this.factForm.validateFields((err, values) => {
                    if (!err) {
                        if (_this.selectedTopic.length) {
                            values.topics = _this.selectedTopic
                        }
                        if (_this.photo) {
                            values.media = _this.photo.id
                        }
                        if (_this.source.url || _this.source.title) {
                            values.source = _this.source
                        }
                        this.$axios.$post('/fact/facts/', values).then(res => {
                            this.$router.replace({path: '/' + res.id})
                        })
                    }
                });
            },
            handleChange(selectedTopic) {
                this.selectedTopic = selectedTopic
            },
            async fetchUrl() {
                let regexUrl = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
                if (this.source.url.match(regexUrl)) {
                    await this.$axios.get('/fact/fetch-url?url=' + this.source.url).then(res => {
                        this.source.title = res.data.title
                        this.source.description = res.data.description
                    })
                }
            },
            async createTopic() {
                let res = await this.$axios.$post('/fact/topics/', {
                    name: this.topicName
                })
                this.topics.push(res)
                this.visible = false
                this.topicName = null
            }
        },
        components: {
            LoginForm,
            Uploader,
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes
            }
        }
    }
</script>

<style scoped>

</style>
