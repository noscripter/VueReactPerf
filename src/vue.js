import Vue from "vue";
import {createStore} from "./vue.data.js";

const store = createStore(50);

Vue.component("game-list", {
    props: ["games"],
    template: `
        <table>
            <thead>
                <tr>
                    <th width="50px">Clock</th>
                    <th width="50px">Score</th>
                    <th width="200px">Teams</th>
                    <th>Outrageous Tackles</th>
                    <th width="100px">Cards</th>
                    <th width="100px">Players</th>
                    <th width="100px"></th>
                    <th width="100px"></th>
                    <th width="100px"></th>
                    <th width="100px"></th>
                </tr>
            </thead>
            <tbody>
                <tr is="game" v-for="game in games" :game="game" />
            </tbody>
        </table>
        `
});


Vue.component("game", {
    props: ["game"],
    computed: {
        score: function () {
            return `${this.game.score.home}-${this.game.score.away}`;
        },
        teams: function () {
            return `${this.game.teams.home} - ${this.game.teams.away}`
        }
    },
    template: `
        <tr>
            <td class="u-center">{{game.clock }}</td>
            <td class="u-center">{{score}}</td>
            <td class="cell--teams">{{teams}}</td>
            <td class="u-center">{{game.outrageousTackles }}</td>
            <td>
                <div class="cards">
                    <div class="cards__card cards__card--yellow">{{game.cards.yellow}}</div>
                    <div class="cards__card cards__card--red">{{game.cards.red}}</div>
                </div>
            </td>
            <td is="player" v-for="player in game.players" :player="player" />
        </tr>
        `
});

Vue.component("player", {
    props: ["player"],
    computed: {
        effortClass: function () {
            return "player__effort " + (this.player.effortLevel < 5 ? "player__effort--low" : "player__effort--high");
        },
        nextWeekMsg: function () {
            return this.player.invitedNextWeek ? "Not coming again" : "Doing well";
        }
    },
    template: `
        <td>
            <div class="player">
                <p class="player__name">
                    <span>{{player.name}}</span>
                    <span class="u-small">
                        {{nextWeekMsg}}
                    </span>
                </p>
                <div class={{effortClass}}>
                </div>
            </div>
        </td>
    `
});

new Vue({
    el: "#app",
    data: {
        games: store.state
    }
});
