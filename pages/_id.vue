<template>
    <a-layout class="fact-detail-page">
        <a-row :gutter="16">
            <a-col class="gutter-row" :md="16" :xs="24">
                <a-layout-content :style="{ minHeight: '700px' }">
                    <a-card class="bt_16 gray fact-card">
                        <div class="featured" slot="cover" v-if="fact.media">
                            <img alt="logo" :src="fact.media.file">
                        </div>
                        <div class="ant-list-item-content bt_16" style="display: unset">
                            <h1>{{fact.short}}</h1>
                            <p>{{fact.long}}</p>
                        </div>
                        <user-card class="bt_16" :user="fact.user">
                            <div class="ant-list-item-meta-description">
                                <small>
                                    <nuxt-link :to="'/' + fact.id.toString()">{{timeSince(fact.created)}}
                                    </nuxt-link>
                                </small>
                            </div>
                        </user-card>
                        <a-row>
                            <a-col :span="12">
                                <a-popover title="Rating">
                                    <template slot="content">
                                        <a-button-group>
                                            <a-button @click="toggleVote(1)" size="small"
                                                      v-bind:class="{'ant-btn-primary': isVoted(1)}">
                                                <a-icon :component="WOWIcon"/>
                                                <span>wow</span>
                                            </a-button>
                                            <a-button @click="toggleVote(2)" size="small"
                                                      v-bind:class="{'ant-btn-primary': isVoted(2)}">
                                                <a-icon :component="FunIcon"/>
                                                <span>interesting</span>
                                            </a-button>
                                            <a-button @click="toggleVote(3)" size="small"
                                                      v-bind:class="{'ant-btn-primary': isVoted(3)}">
                                                <a-icon :component="FunIcon"/>
                                                <span>fun</span>
                                            </a-button>
                                            <a-button @click="toggleVote(4)" size="small"
                                                      v-bind:class="{'ant-btn-primary': isVoted(4)}">
                                                <a-icon :component="BoredIcon"/>
                                                <span>bored</span>
                                            </a-button>
                                        </a-button-group>
                                    </template>
                                    <div class="faq">
                                        <a-button size="small" v-bind:class="{'ant-btn-primary': is_rated}">
                                            <a-icon :component="WOWIcon"/>
                                            <span>Rate</span>
                                        </a-button>
                                    </div>
                                </a-popover>
                            </a-col>
                            <a-col :span="12" v-if="fact.source && typeof fact.source === 'object'">
                                <a-button size="small" style="float: right" @click="showSource = !showSource">
                                    <a-icon type="dash"/>
                                </a-button>
                            </a-col>
                        </a-row>
                        <a-card class="gray" style="margin-top: 16px"
                                v-if="showSource">
                            <h4 v-if="fact.source.title">
                                <a target="_blank" v-if="fact.source.url"
                                   :href="fact.source.url">{{fact.source.title}}</a>
                                <span v-else>{{fact.source.title}}</span>
                            </h4>
                            <q v-if="fact.source.description">{{fact.source.description}}</q>
                        </a-card>
                    </a-card>
                    <Comment :fact-id="fact.id" :response="fact.comment"/>
                </a-layout-content>
            </a-col>
            <a-col class="gutter-row" :md="8" :xs="24">
                <a-layout-sider width="100%" :style="{ background: '#FFF' }">
                    <TopicList
                        label="Topic"
                        :md="24"
                        :data="{results: fact.topics, total: fact.topics.length}"/>
                </a-layout-sider>
            </a-col>
        </a-row>
    </a-layout>
</template>

<script>
    import Comment from '../components/fact/Comment'
    import FunIcon from '../assets/emoij/fun.svg';
    import WOWIcon from '../assets/emoij/wow.svg';
    import WTFIcon from '../assets/emoij/wtf.svg';
    import BoredIcon from '../assets/emoij/bored.svg';
    import TopicList from '../components/topic/List'

    export default {
        name: "PageFactDetail",
        components: {
            Comment,
            TopicList
        },
        head() {
            return {
                title: this.fact.short
            }
        },
        async asyncData({app, params}) {
            let res = await app.$axios.$get(`/fact/facts/${params.id}/`)
            return {
                fact: res,
                is_rated: res.is_rated,
            }
        },
        data() {
            return {
                FunIcon,
                WOWIcon,
                WTFIcon,
                BoredIcon,
                showSource: false
            }
        },
        methods: {
            async toggleVote(value) {
                let data = {
                    value: value,
                    fact: this.fact.id
                }
                if (this.isVoted(value)) {
                    await this.$axios.$delete(`/fact/rates/${this.is_rated.id}/`)
                    this.is_rated.value = 0
                    this.is_rated.id = 0
                    return
                }
                if (this.is_rated && this.is_rated.id) {
                    this.is_rated = await this.$axios.$put(`/fact/rates/${this.is_rated.id}/`, data)
                } else {
                    this.is_rated = await this.$axios.$post('/fact/rates/', data)
                }
            },
            isVoted(value) {
                return this.is_rated && this.is_rated.id && this.is_rated.value === value
            }
        },
    }
</script>

<style scoped>

</style>
