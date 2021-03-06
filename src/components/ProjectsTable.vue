<template>
  <md-table>
    <md-table-header>
      <md-table-row xclass="nofilter">
        <md-table-head class="icon noauth-hide"></md-table-head>
        <md-table-head class="title">Title
          <md-chips
            v-model="filter.artists"
            :md-input-placeholder="filter.artists.length? 'Add' : 'Artist filter'"
            @change="updateFilter">
            <template scope="chip">{{ chip.value }}</template>
          </md-chips>
        </md-table-head>
        <md-table-head class="slim">
          Level
          <md-input-container class="select-x">
            <md-select
              v-model="filter.level"
              @selected="updateFilter"
              placeholder="Select">
              <md-option v-for="grade in levels" :value="grade.value" :title="grade.label">
                {{ grade.value }}
              </md-option>
            </md-select>
            <md-button
              @click.native="filter.level='';updateFilter()">
              <md-icon>cancel</md-icon>
            </md-button>
          </md-input-container>
        </md-table-head>
        <md-table-head>Genre
          <md-chips
            v-model="filter.genres"
            :md-input-placeholder="filter.genres.length? 'Add' : 'Genre filter'"
            @change="updateFilter">
            <template scope="chip">{{ chip.value }}</template>
          </md-chips>
        </md-table-head>
        <md-table-head>Playing style
          <md-chips
            v-model="filter.styles"
            :md-input-placeholder="filter.styles.length? 'Add' : 'Style filter'"
            @change="updateFilter">
            <template scope="chip">{{ chip.value }}</template>
          </md-chips>
        </md-table-head>
        <md-table-head v-if="showAuthor">Author
          <md-chips
            v-model="filter.authors"
            :md-input-placeholder="filter.authors.length? 'Add' : 'Author filter'"
            @change="updateFilter">
            <template scope="chip">{{ chip.value }}</template>
          </md-chips>
        </md-table-head>

        <md-table-head v-if="showLastEdit">Last Edit</md-table-head>

        <md-table-head class="slim" md-numeric>
          <md-icon>thumb_up</md-icon>
          <md-button
            class="sort-toggle"
            @click.native="sortEnabled = !sortEnabled ; updateFilter()">
            <md-icon :class="{ 'md-primary': sortEnabled }">arrow_upward</md-icon>
          </md-button>
        </md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-for="(item, index) in projects" :key="item.project">
        <md-table-cell class="icon noauth-hide">
          <!-- <md-icon>{{ item.starred? 'star' : 'star_border' }}</md-icon> -->
          <md-icon>{{ bookmarks[index]? 'star' : 'star_border' }}</md-icon>
        </md-table-cell>
        <md-table-cell class="title">
          <router-link :to="{ path: '/project/'+item.id }">
            <div class="md-title">{{ item.title }}</div>
            <div class="md-subhead">{{ item.artist || '-' }}</div>
          </router-link>
        </md-table-cell>
        <md-table-cell>
          <!-- {{ item.level }} -->
          <level-meter :value="item.level"></level-meter>
        </md-table-cell>
        <md-table-cell>{{ item.genres.join(', ') }}</md-table-cell>
        <md-table-cell>{{ item.playing_styles.join(', ') }}</md-table-cell>
        <md-table-cell
          v-if="showAuthor"
          class="author">
          <div class="md-title">{{ item.author.name }}</div>
          <div class="md-subhead">{{ item.created | timediff }}</div>
        </md-table-cell>
        <md-table-cell
          v-if="showLastEdit"
          class="date">
          <div class="md-title">{{ item.modified | todate }}</div>
          <div class="md-subhead">{{ item.modified | timediff }}</div>
        </md-table-cell>
        <md-table-cell md-numeric>
          {{ item.likes }}
        </md-table-cell>
      </md-table-row>
    </md-table-body>

  </md-table>
</template>

<script>
import Constants from '../constants.js'
import LevelMeter from './LevelMeter.vue'

export default {
  name: 'projects-table',
  components: { LevelMeter },
  props: {
    projects: {
      type: Array,
      required: true
    },
    showAuthor: Boolean,
    showLastEdit: Boolean
  },
  data() {
    return {
      page: 1,
      sortEnabled: false,
      filter: {
        artists: [],
        genres: [],
        styles: [],
        authors: [],
        level: ''
      },
      levels: [
        {
          value: 'A',
          label: 'Newbie'
        }, {
          value: 'B',
          label: 'Beginner'
        }, {
          value: 'C',
          label: 'Intermediate'
        }, {
          value: 'D',
          label: 'Advanced'
        }, {
          value: 'E',
          label: 'Master'
        }
      ]
    }
  },
  computed: {
    bookmarks() {
      return this.projects.map(item => { return this.$store.state.user.bookmarks.indexOf(item.id) !== -1 })
    }
  },
  methods: {
    updateFilter() {
      console.log('updateFilter')
      this.filter.genres = Constants.MusicalStyles.from(this.filter.genres)
      this.filter.styles = Constants.PlayingStyles.from(this.filter.styles)
      const query = Object.assign({}, this.$route.query)
      for (let key in this.filter) {
        const value = this.filter[key]
        if (value && value.length) {
          // query[key] = value.join(',')
          query[key] = key.endsWith('s')? value.join(',') : value
        } else {
          delete query[key]
        }
      }
      if (this.sortEnabled) {
        query['sort'] = '-likes'
      } else {
        delete query['sort']
      }
      this.$router.push({
        path: this.$route.path,
        query: query
      })
    },
    standardizeGenres() {
      this.filter.genres = Constants.MusicalStyles.from(this.filter.genres)
      this.updateFilter()
    },
    syncWithRoute(route) {
      for (let key in this.filter) {
        if (key.endsWith('s')) {
          this.filter[key] = route.query[key]? route.query[key].split(',') : []
        } else {
          this.filter[key] = route.query[key]
        }
      }
      this.sortEnabled = route.query['sort']? true : false
    },
    onPagination(paginator) {
      const query = Object.assign({}, this.$route.query)
      query.page = paginator.page
      this.$router.push({
        path: this.$route.path,
        query: query
      })
    }
  },
  created() {
    this.syncWithRoute(this.$route)
  },
  watch: {
    '$route' (to, from) {
      // TODO: filter when not active
      console.log('## Route changed ##')
      this.syncWithRoute(to)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.md-menu-item[title]:after {
  content: attr(title);
  opacity: 0.7;
  position: absolute;
  top: 14px;
  left: 36px;
}

.md-table {
  border-bottom: 1px solid #ccc;
  .md-table-row:hover .md-table-cell {
    background-color: #FFF9C4!important;
  }
  .md-table-head {
    background-color: #EEEEEE;
    &.icon {
      width: 32px;
      .md-table-head-container {
        width: inherit;
      }
    }
    &.slim {
      width: 64px;
      .md-table-head-container {
        width: inherit;
      }
      .md-select {
        min-width: 36px;
      }
    }
    .md-table-head-container {
      /* background-color: #EEEEEE!important; */
      height: 80px;
      padding: 8px 0;
    }
    .md-input-container {
      margin: 0;
      padding-top: 4px;
      height: 36px;
      min-height: 36px;
      .md-input {
        font-size: 14px;
        &::-webkit-input-placeholder {
          font-size: 14px;
          opacity: 0.55;
        }
      }
      &:not(.md-has-value) {
        /* md-select placeholder */
        .md-select-value {
          font-weight: 400;
          font-size: 14px;
          opacity: 0.55;
        }
        &.select-x .md-button {
          display: none;
        }
      }
      &.select-x {
        min-width: 44px;
        .md-button {
          margin: 0 0 0 4px;
          padding: 0;
          min-width: 24px;
          min-height: 0;
          outline: none;
          border: none;
          .md-icon {
            margin: 0 0 4px 0;
            &:after {
              display: none;
            }
          }
        }
      }
    }
    .md-button.sort-toggle {
      display: block;
      padding: 0;
      margin: 0;
      min-width: 24px;
      width: 24px;

      opacity: 0.55;
      .md-icon {
        margin: 0;
      }
    }
    .md-chip {
      height: 26px;
      line-height: 12px;
      .md-button.md-delete {
        top: 2px;
      }
    }
    .md-table-head-text {
      height: auto;
      font-size: 14px;
      /* make input field short when not empty */
      .md-chips .md-chip + .md-input {
        width: 64px;
      }
    }
  }

  .md-table-header {
    tr {
      border-bottom: 1px solid #ccc;
    }

    .nofilter .md-table-head {
      xbackground-color: #fff;
      .md-table-head-container {
        height: 56px;
        padding: 16px 0;
        .md-table-head-text > div {
          display: none;
        }
      }
    }
  }

  .md-table-cell {
    padding: 0;
    font-size: 14px;

    .md-table-cell-container {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    &.icon {
      .md-table-cell-container {
        padding: 0 8px;
        opacity: 0.75;
        width: 32px;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        .md-icon {
          font-size: 20px;
          min-width: 0;
          width: 20px;
          margin: 0;
        }
      }
    }
    &.title {
      line-height: 22px;
      a {
        width: 100%;
      }
      .md-title {
        font-size: 18px;
        color: #444;
      }
      .md-subhead {
        font-size: 13px;
        color: #888;
      }
    }
    &.author, &.date {
      .md-title {
        font-size: 15px;
        color: #444;
      }
      .md-subhead {
        font-size: 13px;
        color: #888;
      }
    }
  }
}
</style>
