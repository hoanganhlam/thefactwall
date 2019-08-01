<template>
    <div class="ant-card ant-card-bordered" v-bind:class="{'has-cover': fact.photo && (fact.photo.size || fact.photo.length) }">
        <div slot="cover" class="featured" v-if="fact.photo && (fact.photo._id || fact.photo.length)">
            <img v-if="fact.photo.size" slot="cover" :alt="fact.photo.title"
                 :src="'/' + fact.photo.path">
            <img v-if="fact.photo.length" slot="cover" :alt="fact.photo[0].title"
                 :src="'/' + fact.photo[0].path">
        </div>
        <div class="ant-card-head">
            <user-card :user="user">
                <div class="ant-list-item-meta-description">
                    <small>
                        <nuxt-link :to="'/' + fact._id">{{timeSince(fact.createdAt)}} ago
                        </nuxt-link>
                    </small>
                </div>
                <template v-slot:right>
                    <a-popover style="float: right">
                        <template slot="content">
                            <a-button-group class="vote-wrap">
                                <a-button @click="toggleVote(1)"
                                          v-bind:class="{'ant-btn-primary': checkVoted(1)}">
                                    <a-icon :component="WOWIcon"/>
                                    <span>wow</span>
                                </a-button>
                                <a-button @click="toggleVote(2)"
                                          v-bind:class="{'ant-btn-primary': checkVoted(2)}">
                                    <a-icon :component="FunIcon"/>
                                    <span>interesting</span>
                                </a-button>
                                <a-button @click="toggleVote(3)"
                                          v-bind:class="{'ant-btn-primary': checkVoted(3)}">
                                    <a-icon :component="FunIcon"/>
                                    <span>fun</span>
                                </a-button>
                                <a-button @click="toggleVote(4)"
                                          v-bind:class="{'ant-btn-primary': checkVoted(4)}">
                                    <a-icon :component="BoredIcon"/>
                                    <span>bored</span>
                                </a-button>
                            </a-button-group>
                        </template>
                        <div class="faq">
                            <a-button v-bind:class="{'ant-btn-danger': isVoted}">
                                <span>Vote</span>
                                <a-icon :component="WOWIcon"/>
                            </a-button>
                        </div>
                    </a-popover>
                </template>
            </user-card>
            <div class="ant-card-head-wrapper">
                <div class="wrapper">
                    <Editable :to="'/' + fact._id"
                              v-if="$auth.loggedIn && $auth.user.id === fact.user.id"
                              :text="fact.contentShort" @change="handleUpdate(fact._id, 'contentShort', $event)"/>
                    <div v-else class="ant-card-head-title">
                        <n-link :to="'/' + fact._id">{{factCopy.contentShort}}</n-link>
                    </div>
                    <div class="tags boxed">
                        <nuxt-link
                            v-if="fact.date" class="ant-tag"
                            :to="`/onthisday/${moment(fact.date, 'YYYY-MM-DD').month() + 1}/${moment(fact.date, 'YYYY-MM-DD').date()}/?year=${moment(fact.date).year()}`">
                            <a-icon type="calendar"/>
                            <span>{{formatDate(fact.date)}}</span>
                        </nuxt-link>
                        <nuxt-link
                            v-for="topic in fact.taxonomies" :key="topic._id" class="ant-tag"
                            :to="`/topic/${topic.slug}/`">
                            <a-icon type="tag"/>
                            <span>{{topic.title}} </span>
                        </nuxt-link>
                        <a-tag v-if="fact.source && fact.source.title" @click="showSource = !showSource">
                            <a-icon type="dash"/>
                        </a-tag>
                        <a-popconfirm title="Are you sure delete this fact?"
                                      @confirm="handleDelete" okText="Yes"
                                      cancelText="No">
                            <a-tag>
                                <a-icon type="delete"></a-icon>
                            </a-tag>
                        </a-popconfirm>
                    </div>
                </div>
            </div>
            <a-card style="margin-top: 16px" v-if="showSource">
                <h4 v-if="fact.source.title">
                    <a target="_blank" v-if="fact.source.url" :href="fact.source.url">{{fact.source.title}}</a>
                    <span v-else>{{fact.source.title}}</span>
                </h4>
                <q v-if="fact.source.description">{{fact.source.description}}</q>
            </a-card>
        </div>
    </div>
</template>

<script>
    import FunIcon from '../../assets/emoij/fun.svg';
    import WOWIcon from '../../assets/emoij/wow.svg';
    import WTFIcon from '../../assets/emoij/wtf.svg';
    import BoredIcon from '../../assets/emoij/bored.svg';
    import Editable from '../../components/generic/Editable'

    export default {
        name: "FactCard",
        props: {
            fact: {}
        },
        components: {
            Editable
        },
        data() {
            let isVoted = null
            if (this.fact.isVoted) {
                if (this.fact.isVoted._id) {
                    isVoted = this.fact.isVoted.fact
                } else if (this.fact.isVoted.length) {
                    isVoted = this.fact.isVoted[0]
                }
            }
            return {
                FunIcon,
                WOWIcon,
                WTFIcon,
                BoredIcon,
                isVoted,
                showSource: false,
                factCopy: this.fact
            }
        },
        methods: {
            async toggleVote(value) {
                if (this.$auth.loggedIn) {
                    let data = {
                        value: value,
                    }
                    if (this.checkVoted(value)) {
                        data.value = 0
                    }
                    this.isVoted = await this.$axios.$post(`/facts/${this.fact._id}/vote/`, data)
                } else {
                    this.$notification['warning']({
                        message: 'Member\'s feature',
                        description: 'You must login to vote!',
                    });
                }
            },
            checkVoted(value) {
                return this.isVoted && value === this.isVoted.value
            },
            async handleUpdate(id, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                this.factCopy = await this.$api.fact.update(id, data)
            },
            async handleDelete() {
                await this.$api.fact.delete(this.fact._id)
            }
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
        },
        watch: {
            fact() {
                this.factCopy = this.fact
            }
        }
    }
</script>

<style lang="scss">
</style>
