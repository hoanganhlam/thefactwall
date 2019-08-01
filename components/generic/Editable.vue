<template>
    <div class="editable-cell">
        <div
            v-if="editable"
            class="editable-cell-input-wrapper">
            <a-input
                :value="value"
                @change="handleChange"
                :type="type"
                @pressEnter="check"/>
            <a-icon
                type="check"
                class="editable-cell-icon-check"
                @click="check"/>
        </div>
        <div v-else class="editable-cell-text-wrapper">
            <n-link v-if="to" :to="to">{{ value || ' ' }}</n-link>
            <span v-else>{{ value || ' ' }}</span>
            <a-icon type="edit" class="editable-cell-icon" @click="edit"/>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'EditAble',
        props: {
            text: String,
            type: {
                type: String,
                default: 'textarea'
            },
            to: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                value: this.text,
                editable: false,
            };
        },
        methods: {
            handleChange(e) {
                const value = e.target.value;
                this.value = value;
            },
            check() {
                this.editable = false;
                this.$emit('change', this.value);
            },
            edit() {
                this.editable = true;
            },
        },
        watch: {
            text() {
                this.value = this.text
            }
        }
    };
</script>
