<template>
    <a-card class="fact-card">
        <div class="ant-list-item">
            <div class="ant-list-item-extra-wrap">
                <div class="ant-list-item-main">
                    <div class="ant-list-item-content">
                        <user-card :user="fact.user">
                            <div class="ant-list-item-meta-description">
                                <small>
                                    <nuxt-link :to="'/' + fact.id.toString()">{{timeSince(fact.created)}} ago</nuxt-link>
                                </small>
                            </div>
                        </user-card>
                        <p>{{fact.short}}</p>
                        <div>
                            <nuxt-link
                                v-for="topic in fact.topics" :key="topic.id" class="ant-tag"
                                :to="`/topic/${topic.slug}/`">{{topic.name}}
                            </nuxt-link>
                        </div>
                    </div>
                </div>
                <div class="ant-list-item-extra" v-if="fact.media">
                    <div class="bt_16 featured">
                        <img alt="logo" :src="api_domain + fact.media.thumbnails.thumb_200_123">
                    </div>
                </div>
            </div>
            <a-row>
                <a-col :span="12">
                    <a-popover title="Rating">
                        <template slot="content">
                            <a-button-group>
                                <a-button @click="toggleVote(1)" size="small" v-bind:class="{'ant-btn-primary': isVoted(1)}">
                                    <a-icon :component="WOWIcon"/>
                                    <span>wow</span>
                                </a-button>
                                <a-button @click="toggleVote(2)" size="small" v-bind:class="{'ant-btn-primary': isVoted(2)}">
                                    <a-icon :component="FunIcon"/>
                                    <span>interesting</span>
                                </a-button>
                                <a-button @click="toggleVote(3)" size="small" v-bind:class="{'ant-btn-primary': isVoted(3)}">
                                    <a-icon :component="FunIcon"/>
                                    <span>fun</span>
                                </a-button>
                                <a-button @click="toggleVote(4)" size="small" v-bind:class="{'ant-btn-primary': isVoted(4)}">
                                    <a-icon :component="BoredIcon"/>
                                    <span>bored</span>
                                </a-button>
                            </a-button-group>
                        </template>
                        <span class="faq">
                    <a-button size="small" v-bind:class="{'ant-btn-primary': is_rated}">
                        <a-icon :component="WOWIcon"/>
                        <span>Rate</span>
                    </a-button>
                </span>
                    </a-popover>
                </a-col>
                <a-col :span="12" v-if="fact.source && typeof fact.source === 'object'">
                    <a-button size="small" style="float: right" @click="showSource = !showSource">
                        <a-icon type="dash"/>
                    </a-button>
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
    </a-card>
</template>

<script>
    import FunIcon from '../../assets/emoij/fun.svg';
    import WOWIcon from '../../assets/emoij/wow.svg';
    import WTFIcon from '../../assets/emoij/wtf.svg';
    import BoredIcon from '../../assets/emoij/bored.svg';

    export default {
        name: "FactCard",
        props: {
            fact: {}
        },
        data() {
            return {
                FunIcon,
                WOWIcon,
                WTFIcon,
                BoredIcon,
                is_rated: this.fact.is_rated,
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
        }
    }
</script>

<style lang="scss">
</style>
