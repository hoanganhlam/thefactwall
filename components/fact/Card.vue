<template>
    <div>
        <div class="ant-list-item">
            <div class="ant-list-item-extra-wrap">
                <div class="ant-list-item-main">
                    <div class="ant-list-item-content">
                        <user-card :user="fact.user">
                            <div class="ant-list-item-meta-description">
                                <small>
                                    <nuxt-link :to="'/' + fact.id.toString()">{{timeSince(fact.created)}} ago
                                    </nuxt-link>
                                </small>
                            </div>
                        </user-card>
                        <Editable
                            v-if="$auth.loggedIn && $auth.user.id === fact.user.id"
                            :text="fact.short" @change="handleUpdate(fact.id, 'name', $event)"/>
                        <p v-else>{{factCopy.short}}</p>
                    </div>
                </div>
                <div class="ant-list-item-extra" v-if="fact.media">
                    <div class="bt_16 featured">
                        <img alt="logo" :src="api_domain + fact.media.thumbnails.thumb_200_123">
                    </div>
                </div>
            </div>
            <a-row class="tags">
                <a-col :span="6">
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
                            <a-button size="small" v-bind:class="{'ant-btn-primary': is_rated && is_rated.id}">
                                <a-icon :component="WOWIcon"/>
                                <span>Rate</span>
                            </a-button>
                        </div>
                    </a-popover>
                </a-col>
                <a-col :span="18" style="text-align: right">
                    <nuxt-link
                        v-if="fact.date" class="ant-tag"
                        :to="`/onthisday/${moment(fact.date).month() + 1}/${moment(fact.date).date()}/?year=${moment(fact.date).year()}`">
                        <a-icon type="calendar"/>
                        <span>{{formatDate(fact.date)}}</span>
                    </nuxt-link>
                    <nuxt-link
                        v-for="topic in fact.topics" :key="topic.id" class="ant-tag"
                        :to="`/topic/${topic.slug}/`">
                        <a-icon type="tag"/>
                        <span>{{topic.name}} </span>
                    </nuxt-link>
                    <a-tag v-if="fact.source && typeof fact.source === 'object'" @click="showSource = !showSource">
                        <a-icon type="dash"/>
                    </a-tag>
                </a-col>
            </a-row>
            <a-card class="gray" style="margin-top: 16px" v-if="showSource">
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
            return {
                FunIcon,
                WOWIcon,
                WTFIcon,
                BoredIcon,
                is_rated: this.fact.is_rated,
                showSource: false,
                factCopy: this.fact
            }
        },
        watchQuery: true,
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
            },
            async handleUpdate(id, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                this.factCopy = await this.$axios.$put(`/fact/facts/${id}/`, data)
            }
        }
    }
</script>

<style lang="scss">
</style>
