<template>
    <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="18">
            <LoginForm v-if="!$auth.loggedIn"/>
            <a-form
                v-else
                layout="vertical"
                id="components-form-demo-normal-login"
                class="login-form">
                <div class="ant-row ant-form-item">
                    <div class="ant-form-item-label">
                        <label title="Topics" class="">Topics</label>
                        <span style="cursor: pointer; float: right" @click="visible = true">
                            <a-icon type="plus"/>
                        </span>
                    </div>
                    <div class="ant-form-item-control-wrapper">
                        <div class="ant-form-item-control">
                            <div class="ant-form-item-children">
                                <a-select
                                    mode="multiple"
                                    :value="form.taxonomies"
                                    placeholder="Select topics"
                                    style="width: 100%"
                                    :filterOption="false"
                                    @search="fetchTopic"
                                    @change="handleChange"
                                    :notFoundContent="fetching ? undefined : null">
                                    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                                    <a-select-option v-for="d in topics" :key="d._id">{{d.title}}</a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </div>
                </div>
                <a-form-item label="Title">
                    <a-textarea v-model="form.contentShort" placeholder="Title or summary" autosize/>
                </a-form-item>
                <a-form-item label="More detail.....">
                    <a-textarea v-model="form.contentLong" placeholder="fact's detail"/>
                </a-form-item>
                <a-form-item label="Source">
                    <a-card>
                        <a-input @blur="fetchUrl" v-model="form.source.url" placeholder="https://..."/>
                        <a-divider>or</a-divider>
                        <a-input v-model="form.source.title" style="margin-bottom: 10px" placeholder="From..."/>
                        <a-textarea v-model="form.source.description" placeholder="Description..."
                                    :autosize="{ minRows: 2 }"/>
                    </a-card>
                </a-form-item>
                <a-form-item label="Date">
                    <a-date-picker v-model="form.date" format="YYYY-MM-D"/>
                </a-form-item>
                <a-form-item label="Media">
                    <Uploader @uploaded="form.photo = $event ? $event._id: null"/>
                </a-form-item>
                <a-form-item>
                    <a-button class="full-width" type="primary" @click="handleSubmit">
                        {{fact ? 'Update': 'Post'}}
                    </a-button>
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
    import moment from "moment";

    export default {
        name: "Post",
        props: ['fact'],
        data() {
            this.fetchTopic = debounce(this.fetchTopic, 500);
            this.fetchUrl = debounce(this.fetchUrl, 500);
            return {
                topics: [],
                fetching: false,
                visible: false,
                topicName: null,
                form: {
                    contentShort: null,
                    contentLong: null,
                    photo: null,
                    taxonomies: [],
                    source: {
                        url: null,
                        title: null,
                        description: null
                    },
                    date: moment().utc(),
                },
            }
        },
        methods: {
            fetchTopic(value) {
                this.data = []
                this.fetching = true
                this.$api.taxonomy.list({search: value}).then(res => {
                    this.topics = res.results
                    this.fetching = false
                })
            },
            handleSubmit() {
                if (this.fact && this.fact._id) {
                    this.$api.fact.update(this.fact._id, this.form).then(res => {
                        this.$router.replace({path: '/' + this.fact._id})
                    })
                } else {
                    this.$api.fact.post(this.form).then(res => {
                        this.$router.replace({path: '/' + res._id})
                    })
                }
            },
            handleChange(selectedTopic) {
                this.form.taxonomies = selectedTopic
            },
            async fetchUrl() {
                let regexUrl = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
                if (this.form.source.url && this.form.source.url.match(regexUrl)) {
                    await this.$axios.get('/utilities/scrape?url=' + this.form.source.url).then(res => {
                        this.form.source.title = res.data.title
                        this.form.source.description = res.data.metaDescription
                    })
                }
            },
            async createTopic() {
                let res = await this.$api.taxonomy.post({title: this.topicName})
                this.topics.push(res)
                this.form.taxonomies.push(res._id)
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
        },
        created() {
            if (this.fact) {
                this.topics = this.fact.taxonomies
                for (let field in this.fact) {
                    if (this.fact[field] && field !== '_id') {
                        if (field === 'taxonomies') {
                            this.form[field] = this.fact[field].map(x => x._id)
                        } else if (field === 'media') {
                            this.form[field] = this.fact[field]._id
                        } else if (field === 'date') {
                            this.form[field] = moment(this.fact[field], 'YYYY-MM-DD')
                        } else {
                            this.form[field] = this.fact[field]
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
