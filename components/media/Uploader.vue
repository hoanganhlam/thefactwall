<template>
    <div>
        <a-upload-dragger
            v-if="photo === null"
            :multiple="false"
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload">
            <p class="ant-upload-drag-icon">
                <a-icon type="inbox"/>
            </p>
            <p class="ant-upload-text"></p>
        </a-upload-dragger>
        <div v-else>
            <a-card hoverable style="width: 100%">
                <img alt="example" :src="`/${size && photo.size ? photo.size[size] : photo.path}`" slot="cover"/>
                <a-card-meta v-if="allowUpdate">
                    <a-input @change="handleChange" slot="description" v-model="photo.title" placeholder="Photo's title"/>
                </a-card-meta>
            </a-card>
        </div>
    </div>
</template>
<script>
    import debounce from 'lodash/debounce';

    export default {
        name: 'Uploader',
        props: {
            isSingle: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Object,
                default: null
            },
            text: {
                type: String,
                default: 'Click or drag file to this area to upload'
            },
            size: {
                type: String,
                default: null
            },
            allowUpdate: {
                type: Boolean,
                default: true
            }
        },
        data() {
            this.handleChange = debounce(this.handleChange, 500);
            return {
                fileList: [],
                singleFile: null,
                photo: this.selected
            }
        },
        methods: {
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList
            },
            async beforeUpload(file) {
                let formData = new FormData()
                formData.append('file', file)
                let res = await this.$axios.$post('/files/', formData)
                this.photo = res
                this.$emit('uploaded', res)
                return false;
            },
            async handleChange() {
                this.$axios.put(`/files/${this.photo._id}/`, {
                    title: this.photo.title
                })
            }
        },
        watch: {
            selected() {
                this.photo = this.selected
            }
        }
    }
</script>
