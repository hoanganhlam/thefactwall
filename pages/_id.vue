<template>
    <a-layout class="fact-detail-page">
        <a-row :gutter="16">
            <a-col class="gutter-row bt_16" :md="16" :xs="24">
                <a-layout-content :style="{ minHeight: '700px' }">
                    <a-card class="bt_16 fact-card">
                        <div class="bt_32">
                            <div class="featured bt_16" slot="cover" v-if="fact.photo">
                                <img alt="logo" :src="fact.photo.path">
                            </div>
                            <div class="ant-list-item-content bt_16" style="display: unset">
                                <h1>{{fact.contentShort}}</h1>
                                <p>{{fact.contentLong}}</p>
                            </div>
                            <user-card class="bt_16" :user="user">
                                <div class="ant-list-item-meta-description">
                                    <small>
                                        <nuxt-link :to="'/' + fact._id">{{timeSince(fact.createdAt)}}
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
                                                          v-bind:class="{'ant-btn-primary': checkVoted(1)}">
                                                    <a-icon :component="WOWIcon"/>
                                                    <span>wow</span>
                                                </a-button>
                                                <a-button @click="toggleVote(2)" size="small"
                                                          v-bind:class="{'ant-btn-primary': checkVoted(2)}">
                                                    <a-icon :component="FunIcon"/>
                                                    <span>interesting</span>
                                                </a-button>
                                                <a-button @click="toggleVote(3)" size="small"
                                                          v-bind:class="{'ant-btn-primary': checkVoted(3)}">
                                                    <a-icon :component="FunIcon"/>
                                                    <span>fun</span>
                                                </a-button>
                                                <a-button @click="toggleVote(4)" size="small"
                                                          v-bind:class="{'ant-btn-primary': checkVoted(4)}">
                                                    <a-icon :component="BoredIcon"/>
                                                    <span>bored</span>
                                                </a-button>
                                            </a-button-group>
                                        </template>
                                        <a-button size="small" v-bind:class="{'ant-btn-primary': isVoted}">
                                            <a-icon :component="WOWIcon"/>
                                        </a-button>
                                    </a-popover>
                                </a-col>
                                <a-col :span="12">
                                    <div style="float: right">
                                        <a-button
                                            size="small"
                                            v-if="fact.source && fact.title"
                                            @click="showSource = !showSource">
                                            <a-icon type="dash"/>
                                        </a-button>
                                        <a-button v-if="$auth.loggedIn" size="small" @click="isUpdate = !isUpdate">
                                            <a-icon type="edit"/>
                                        </a-button>
                                    </div>
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
                        </div>
                        <Comment :fact-id="fact._id" :response="{results: fact.comments}"/>
                    </a-card>
                </a-layout-content>
            </a-col>
            <a-col class="gutter-row" :md="8" :xs="24">
                <a-layout-sider width="100%">
                    <h4 class="uppercase">Related topics</h4>
                    <TopicList
                        label="Topic"
                        :md="12"
                        :data="{results: fact.taxonomies, total: fact.taxonomies.length}"/>
                </a-layout-sider>
            </a-col>
        </a-row>
        <a-modal
            :visible="isUpdate"
            @ok="handleOk"
            @cancel="handleCancel">
            <PostFact :fact="fact" @done="isUpdate = false"/>
        </a-modal>
    </a-layout>
</template>

<script>
    import Comment from '../components/fact/Comment'
    import FunIcon from '../assets/emoij/fun.svg';
    import WOWIcon from '../assets/emoij/wow.svg';
    import WTFIcon from '../assets/emoij/wtf.svg';
    import BoredIcon from '../assets/emoij/bored.svg';
    import TopicList from '../components/topic/List'
    import PostFact from '../components/fact/Post'

    export default {
        name: "PageFactDetail",
        components: {
            Comment,
            TopicList,
            PostFact
        },
        head() {
            return {
                title: this.fact.contentShort
            }
        },
        async asyncData({app, params}) {
            let res = await app.$api.fact.get(params.id, null)
            return {
                fact: res,
                isVoted: res.isVoted,
            }
        },
        data() {
            return {
                FunIcon,
                WOWIcon,
                WTFIcon,
                BoredIcon,
                showSource: false,
                isUpdate: false
            }
        },
        methods: {
            async toggleVote(value) {
                let data = {
                    value: value,
                }
                if (this.checkVoted(value)) {
                    data.value = 0
                }
                this.isVoted = await this.$axios.$post(`/facts/${this.fact._id}/vote/`, data)
            },
            checkVoted(value) {
                return this.isVoted && value === this.isVoted.value
            },
            handleOk(e) {
                this.isUpdate = false;
            },
            handleCancel(e) {
                this.isUpdate = false
            },
        },
        computed: {
            user() {
                if (this.fact.user) {
                    if (this.fact.user._id) {
                        return this.fact.user
                    } else if (this.fact.user.length) {
                        return this.fact.user[0]
                    }
                }
                return null
            }
        }
    }
</script>

<style scoped>

</style>
