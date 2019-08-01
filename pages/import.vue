<template>
    <div v-if="$auth.loggedIn && $auth.user.email === 'lam@trip.vn'">
        <a-row :gutter="16">
            <a-col :span="6">
                <a-input v-model="url"></a-input>
            </a-col>
            <a-col :span="8">
                <a-select style="width: 100%" @change="handleChangeTopic">
                    <a-select-option v-for="t in factTopics" :key="t._id">{{t.value.title}}</a-select-option>
                </a-select>
            </a-col>
            <a-col :span="2">
                <a-input-number placeholder="minutes" v-model="timeInterval"></a-input-number>
            </a-col>
            <a-col :span="8">
                <TagInput v-model="defaultTags"/>
            </a-col>
        </a-row>
        <a-table :columns="columns" :dataSource="dataset">
            <div slot="action" slot-scope="record">
                <a-button @click="postFact(record)" :disabled="record.disabled">
                    <span>Save</span>
                    <a-icon type="save"></a-icon>
                </a-button>
            </div>
            <div slot="taxonomies" slot-scope="text, record">
                <TagInput v-model="record.taxTexts"/>
            </div>
            <div slot="createdAt" slot-scope="text, record">
                <a-row>
                    <a-col :span="14">
                        <a-date-picker v-model="record.createdAt"/>
                    </a-col>
                    <a-col :span="10">
                        <a-time-picker v-model="record.createdAt" format="HH:mm"/>
                    </a-col>
                </a-row>
            </div>
            <div slot="contentShort" slot-scope="text, record">
                <a-input v-model="record.contentShort"></a-input>
            </div>
            <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                <div>
                    <a-row :gutter="16">
                        <a-col :md="10">
                            <a-form-item style="width: 100%">
                                <a-date-picker placeholder="Fact date" v-model="record.date"/>
                            </a-form-item>
                            <a-form-item style="width: 100%">
                                <a-input type="textarea" placeholder="Long content"
                                         v-model="record.contentLong"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :md="10">
                            <a-form-item style="width: 100%">
                                <a-input placeholder="Source Url" v-model="record.source.url"></a-input>
                            </a-form-item>
                            <a-form-item style="width: 100%">
                                <a-input placeholder="Source Title" v-model="record.source.title"></a-input>
                            </a-form-item>
                            <a-form-item style="width: 100%">
                                <a-input placeholder="Source description" v-model="record.source.description"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :md="4">
                            <Uploader @uploaded="record.photo = $event ? $event._id: null"/>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </a-table>
    </div>
</template>

<script>
    import ObjectSelect from '../components/generic/ObjectSelect'
    import TagInput from '../components/generic/TagInput'
    import Uploader from '../components/media/Uploader'

    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };
    const moment = require('moment')
    const columns = [
        {
            title: 'Taxonomies',
            width: 300,
            dataIndex: 'taxonomies',
            key: 'taxonomies',
            scopedSlots: {customRender: 'taxonomies'}
        },
        {
            title: 'Published',
            width: 270,
            dataIndex: 'createdAt',
            key: 'createdAt',
            scopedSlots: {customRender: 'createdAt'}
        },
        {
            title: 'Content Short',
            dataIndex: 'contentShort',
            key: 'contentShort',
            scopedSlots: {customRender: 'contentShort'}
        },
        {
            title: 'Action',
            key: 'operation',
            width: 100,
            scopedSlots: {customRender: 'action'},
        },
    ];
    const temp = {
        title: null,
        contentShort: null,
        contentLong: null,
        taxSlugs: [],
        photo: null,
        source: {},
        taxonomies: [],
        date: null,
        createdAt: new moment()
    }

    export default {
        name: "import",
        components: {Uploader, TagInput},
        data() {
            return {
                columns,
                dataset: [],
                url: 'http://45.32.59.190:2019/api/dataset?campaign=5d3d490839461e6bd708389d',
                factTopics: [],
                topic: null,
                timeInterval: 5,
                defaultTags: []
            }
        },
        methods: {
            async fetchDataCrawled() {
                let {results, total} = await this.$axios.$get(this.url)
                this.factTopics = results
            },
            handleChangeTopic(topic) {
                this.topic = this.factTopics.filter(x => x._id === topic)[0]
                this.dataset = []
                let key = 0
                this.dataset = this.topic.value.facts.map(fact => {
                    key = key + 1
                    return {
                        key: key,
                        contentShort: fact.replace(/\[.*\]/, ''),
                        source: {},
                        photo: null,
                        taxTexts: this.defaultTags,
                        contentLong: null,
                        title: null,
                        date: null,
                        createdAt: new moment().add(key * this.timeInterval, 'm'),
                        disabled: false
                    }
                })
            },
            async postFact(fact) {
                await this.$api.fact.post(fact)
                fact.disabled = true
            }
        },
        watch: {
            defaultTags() {
                this.dataset.forEach(data => {
                    data.taxTexts = data.taxTexts.concat(this.defaultTags).unique()
                })
            },
            timeInterval() {
                this.dataset.forEach(data => {
                    data.createdAt = new moment().add(data.key * this.timeInterval, 'm')
                })
            },
            url() {
                this.fetchDataCrawled()
            }
        },
        mounted() {
            this.fetchDataCrawled()
        }
    }
</script>

<style scoped>

</style>
