import Ractive from "ractive";

import {createGames, createStore} from "../vue/data.js";

Ractive.components.GameList = Ractive.extend({
    // onconfig() {
    //     createGames(50).subscribe((games) => {
    //         this.set("games", games)
    //     });
    // },
    magic: true,
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
                {{#each games}}
                    <Game game="{{this}}" />
                {{/each}}
            </tbody>
        </table>
        `
});

Ractive.components.Game = Ractive.extend({
    magic: true,
    computed: {
        score: function () {
            const game = this.get().game;
            return `${game.score.home}-${game.score.away}`;
        },
        teams: function () {
            const game = this.get().game;
            return `${game.teams.home} - ${game.teams.away}`
        }
    },
    template: `
        <tr>
            <td class="u-center">{{this.game.clock }}</td>
            <td class="u-center">{{this.score}}</td>
            <td class="cell--teams">{{this.teams}}</td>
            <td class="u-center">{{this.game.outrageousTackles }}</td>
            <td>
                <div class="cards">
                    <div class="cards__card cards__card--yellow">{{this.game.cards.yellow}}</div>
                    <div class="cards__card cards__card--red">{{this.game.cards.red}}</div>
                </div>
            </td>
            {{#each players}}
                <Player player="{{this}}" />
            {{/each}}
        </tr>
        `
});

Ractive.components.Player = Ractive.extend({
    magic: true,
    computed: {
        effortClass: function () {
            console.info("calculating")
            const player = this.get().player;
            return "player__effort " + (player.effortLevel < 5 ? "player__effort--low" : "player__effort--high");
        },
        nextWeekMsg: function () {
            const player = this.get().player;
            return player.invitedNextWeek ? "Not coming again" : "Doing well";
        },
        coveredMessage: function () {
            const player = this.get().player;
            return `Distance covered: ${player.distanceRan}m`;
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
        <td >
            <div class="player">
                <p class="player__name">
                    <span>{{this.player.name}}</span>
                    <span class="u-small">
                        {{this.coveredMessage}}
                    </span>
                </p>
                <div class={{this.effortClass}}>
                </div>
            </div>
        </td>
    `
});

const store = window.store = createStore(50);

new Ractive({
    magic: true,
    el: "#app",
    template: `
        <div>
            <p>hello</p>
            <GameList games='{{games}}'/>
        </div>
        `,
    data: {
        games: store.state
    }
});