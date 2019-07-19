<template>
    <a-table :columns="columns" :dataSource="dataset" rowKey="id" key="s">
        <div slot="action" slot-scope="text">
            a
        </div>
        <div slot="taxonomies" slot-scope="text, record">
            <ObjectSelect/>
        </div>
        <div slot="createdAt" slot-scope="text, record">
            <a-date-picker v-model="record.createdAt"/>
        </div>
        <div slot="contentShort" slot-scope="text, record">
            <a-input v-model="record.contentShort"></a-input>
        </div>
        <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <div>
                <a-row :gutter="16">
                    <a-col :md="10">
                        <a-form-item style="width: 100%">
                            <a-date-picker v-model="record.date"/>
                        </a-form-item>
                        <a-form-item style="width: 100%">
                            <a-input type="textarea" v-model="record.contentLong"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="10">
                        <a-form-item style="width: 100%">
                            <a-input v-model="record.source.url"></a-input>
                        </a-form-item>
                        <a-form-item style="width: 100%">
                            <a-input v-model="record.source.title"></a-input>
                        </a-form-item>
                        <a-form-item style="width: 100%">
                            <a-input v-model="record.source.description"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4">
                        <Uploader @uploaded="record.photo = $event ? $event._id: null"/>
                    </a-col>
                </a-row>
            </div>
        </div>
    </a-table>
</template>

<script>
    import ObjectSelect from '../components/generic/ObjectSelect'
    import Uploader from '../components/media/Uploader'

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
            width: 200,
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
    const dataset = [
        {
            id: 1,
            title: null,
            contentShort: null,
            contentLong: null,
            taxSlugs: [],
            photo: null,
            source: {
                url: null,
                title: null,
                description: null
            },
            taxonomies: [],
            date: null,
            createdAt: new moment(),
            sourceUrl: null
        }
    ]

    export default {
        name: "import",
        components: {ObjectSelect, Uploader},
        data() {
            return {
                columns,
                dataset: dataset
            }
        }
    }
</script>

<style scoped>

</style>
