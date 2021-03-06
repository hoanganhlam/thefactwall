<template>
    <div class="fact-detail-page">
        <div class="container">
            <a-row :gutter="20" type="flex" justify="center">
                <a-col class="gutter-row bt_16" :md="16" :xs="24">
                    <a-layout-content :style="{ minHeight: '700px' }">
                        <a-card class="bt_16 fact-card">
                            <div class="bt_32">
                                <div class="featured bt_16" slot="cover" v-if="fact.photo">
                                    <img :alt="fact.photo.title" :src="'/' + fact.photo.path">
                                </div>
                                <div class="ant-list-item-content bt_16" style="display: unset">
                                    <div v-if="$route.params.id === 'random'">
                                        <a-row>
                                            <a-col :span="20">
                                                <h1 style="font-size: 16px;" class="uppercase">{{title}}</h1>
                                            </a-col>
                                            <a-col :span="4">
                                                <a-button style="float: right" @click="reset()">
                                                    <a-icon type="retweet"></a-icon>
                                                </a-button>
                                            </a-col>
                                        </a-row>
                                        <h2>{{fact.contentShort}}</h2>
                                    </div>
                                    <h1 v-else>{{fact.contentShort}}</h1>
                                    <p v-if="fact.contentLong">{{fact.contentLong}}</p>
                                </div>
                                <user-card class="bt_16" :user="user">
                                    <div class="ant-list-item-meta-description">
                                        <small>
                                            <nuxt-link :to="'/' + fact._id">{{timeSince(fact.createdAt)}}</nuxt-link>
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
                                            <a-button v-bind:class="{'ant-btn-primary': isVoted}">
                                                <span>Vote</span>
                                                <a-icon :component="WOWIcon"/>
                                            </a-button>
                                        </a-popover>
                                    </a-col>
                                    <a-col :span="12">
                                        <div style="float: right">
                                            <a-button
                                                    v-if="fact.source && fact.title"
                                                    @click="showSource = !showSource">
                                                <a-icon type="dash"/>
                                            </a-button>
                                            <a-button v-if="$auth.loggedIn" @click="isUpdate = !isUpdate">
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
                        <h4 class="uppercase">Related topics</h4>
                        <TopicList label="Topic" :md="6" :xs="12"
                                   :data="{results: fact.taxonomies, total: fact.taxonomies.length}"/>
                    </a-layout-content>
                </a-col>
            </a-row>
        </div>
        <a-modal
                :visible="isUpdate"
                @ok="handleOk"
                @cancel="handleCancel">
            <PostFact :fact="fact" @done="isUpdate = false"/>
        </a-modal>
    </div>
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
                title: this.title
            }
        },
        async asyncData({app, params}) {
            let res = await app.$api.fact.get(params.id, null)
            let title = params.id === 'random' ? 'Random facts' : res.title || res.contentShort
            return {
                fact: res,
                isVoted: res.isVoted,
                title
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
            async reset() {
                this.fact = await this.$api.fact.get('random', null)
            },

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
