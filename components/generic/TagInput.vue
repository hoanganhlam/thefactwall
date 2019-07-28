<template>
    <div style="line-height: 2">
        <template v-for="(tag, index) in tags">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag" :closable="true" :afterClose="() => handleClose(tag)">
                    {{`${tag.slice(0, 20)}...`}}
                </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :closable="true" :afterClose="() => handleClose(tag)">
                {{tag}}
            </a-tag>
        </template>
        <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
        />
        <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus"/>
            New Tag
        </a-tag>
    </div>
</template>
<script>
    export default {
        name: 'TagInput',
        props: {
            value: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                tags: this.value,
                inputVisible: false,
                inputValue: '',
            }
        },
        methods: {
            handleClose(removedTag) {
                const tags = this.tags.filter(tag => tag !== removedTag)
                this.tags = tags
                this.$emit('input', this.tags)
            },

            showInput() {
                this.inputVisible = true
                this.$nextTick(function () {
                    this.$refs.input.focus()
                })
            },

            handleInputChange(e) {
                this.inputValue = e.target.value
                this.$emit('input', this.tags)
            },

            handleInputConfirm() {
                const inputValue = this.inputValue
                let tags = this.tags
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue]
                }
                console.log(tags)
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                })
                this.$emit('input', this.tags)
            },
        },
        watch: {
            value() {
                this.tags = this.value
            }
        }
    }
</script>
