import Vue from "vue";
import {createStore} from "./vue.data.js";

const store = createStore(50);

let popoverState = {
    content: null,
    visible: false,
    x: 0,
    y: 0
}


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
        },
        coveredMessage: function () {
            return `Distance covered: ${this.player.distanceRan}m`;
        }
    },
    methods: {
        displayPopup: function () {
            const position = this.$el.getBoundingClientRect();

            popoverState.x = position.left;
            popoverState.y = position.top;
            popoverState.visible = true;
            popoverState.content = this.coveredMessage;

            //DIFFENCE
            //popoverSTate.content is observed by popover Vue instance
            //we want to update it if we're displaying the hover for this player
            //so we watch our own computed prop whilst hovered
            //then mutate the popoverState
            //awesome!
            this._unwatchMsg = this.$watch("coveredMessage", (msg) => {
                popoverState.content = msg;
            });
        },
        hidePopup: function () {
            this._unwatchMsg();
        }
    },
    template: `
        <td @mouseenter="displayPopup" @mouseleave="hidePopup">
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

Vue.component("popover", {
    props: ["state"],
    computed: {
        style: function () {
            const width = 150;
            const height = 30;

            return {
                display: this.state.visible ? "block" : "none",
                height,
                width,
                position: "absolute",

                //DIFFERENT FROM REACT
                //can't just return a number
                top: `${this.state.y + 40}px`,
                left: `${this.state.x}px`,

                zIndex: 2,
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
                padding: "5px"
            }
        }
    },
    template: `
        <div class="popover" :style="style">
            <div class="popover__contents>
                <span style="font-size: 13px">
                    {{state.content}}
                </span>
            </div>
        </div>
    `
});

new Vue({
    el: "#app",
    data: {
        games: store.state
    }
});

new Vue({
    el: "#popover",
    data: {
        max: true,
        state: popoverState
    }
})
